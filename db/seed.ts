import 'dotenv/config';
import { createHash } from 'node:crypto';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { users, sites, scanners, scans, findings } from './schema';

const db = drizzle(process.env.DATABASE_URL!);

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000);

const fingerprintOf = (scannerSlug: string, ruleId: string, location: string) =>
  createHash('sha256').update(`${scannerSlug}:${ruleId}:${location}`).digest('hex');

async function main() {
  await db.insert(users)
    .values({ email: 'dev@example.com' })
    .onConflictDoNothing();

  const [user] = await db.select().from(users).where(eq(users.email, 'dev@example.com'));

  await db.insert(sites)
    .values([
      {
        ownerId: user.id,
        hostname: 'example.com',
        status: 'verified',
        verifiedMethod: 'meta',
        verifiedAt: minutesAgo(2880),
        lastCheckedAt: minutesAgo(30),
      },
      { ownerId: user.id, hostname: 'localhost.test' },
    ])
    .onConflictDoNothing();

  await db.insert(scanners)
    .values([
      { slug: 'pagespeed', name: 'PageSpeed Insights' },
      { slug: 'tenable', name: 'Tenable' },
    ])
    .onConflictDoNothing();

  const [verifiedSite] = await db.select().from(sites).where(eq(sites.hostname, 'example.com'));
  const [pendingSite] = await db.select().from(sites).where(eq(sites.hostname, 'localhost.test'));
  const [pagespeed] = await db.select().from(scanners).where(eq(scanners.slug, 'pagespeed'));
  const [tenable] = await db.select().from(scanners).where(eq(scanners.slug, 'tenable'));

  const [seeded] = await db.select({ id: scans.id }).from(scans).limit(1);

  if (seeded) {
    console.log('Scans already present, skipped scans and findings');
    process.exit(0);
  }

  const [pagespeedScan] = await db.insert(scans)
    .values({
      siteId: verifiedSite.id,
      scannerId: pagespeed.id,
      startedAt: minutesAgo(35),
      finishedAt: minutesAgo(34),
      status: 'completed',
    })
    .returning();

  const [tenableScan] = await db.insert(scans)
    .values({
      siteId: verifiedSite.id,
      scannerId: tenable.id,
      startedAt: minutesAgo(30),
      finishedAt: minutesAgo(26),
      status: 'completed',
    })
    .returning();

  const [previousTenableScan] = await db.insert(scans)
    .values({
      siteId: verifiedSite.id,
      scannerId: tenable.id,
      startedAt: minutesAgo(1470),
      finishedAt: minutesAgo(1465),
      status: 'completed',
    })
    .returning();

  await db.insert(scans)
    .values({
      siteId: pendingSite.id,
      scannerId: pagespeed.id,
      startedAt: minutesAgo(10),
      finishedAt: minutesAgo(10),
      status: 'failed',
      error: 'Could not reach host',
    });

  await db.insert(findings)
    .values([
      {
        siteId: verifiedSite.id,
        scannerId: pagespeed.id,
        firstScanId: pagespeedScan.id,
        lastScanId: pagespeedScan.id,
        title: 'Largest Contentful Paint is 4.2 s',
        description: 'The hero image is loaded late and blocks the main content from painting.',
        additionalInfo: 'https://web.dev/lcp/',
        severity: 'high',
        category: 'seo',
        location: 'https://example.com/',
        fingerprint: fingerprintOf('pagespeed', 'largest-contentful-paint', 'https://example.com/'),
        discoveredAt: minutesAgo(34),
        lastSeenAt: minutesAgo(34),
      },
      {
        siteId: verifiedSite.id,
        scannerId: pagespeed.id,
        firstScanId: pagespeedScan.id,
        lastScanId: pagespeedScan.id,
        title: 'Images without width and height',
        description: 'Six images have no intrinsic size, which causes layout shift.',
        severity: 'low',
        category: 'accessibility',
        location: 'https://example.com/pricing',
        fingerprint: fingerprintOf('pagespeed', 'unsized-images', 'https://example.com/pricing'),
        discoveredAt: minutesAgo(34),
        lastSeenAt: minutesAgo(34),
        assigneeId: user.id,
        dueAt: minutesAgo(-10080),
      },
      {
        siteId: verifiedSite.id,
        scannerId: tenable.id,
        firstScanId: previousTenableScan.id,
        lastScanId: tenableScan.id,
        title: 'nginx 1.18.0 is affected by CVE-2021-23017',
        description: 'The resolver accepts a crafted DNS response that can cause memory corruption.',
        severity: 'critical',
        category: 'security',
        location: 'https://example.com',
        fingerprint: fingerprintOf('tenable', '147160', 'https://example.com'),
        cve: 'CVE-2021-23017',
        cwe: 'CWE-787',
        discoveredAt: minutesAgo(1465),
        lastSeenAt: minutesAgo(26),
      },
      {
        siteId: verifiedSite.id,
        scannerId: tenable.id,
        firstScanId: previousTenableScan.id,
        lastScanId: tenableScan.id,
        title: 'Missing Content-Security-Policy header',
        description: 'Responses do not set a CSP, so injected scripts are not restricted.',
        severity: 'medium',
        category: 'security',
        location: 'https://example.com',
        fingerprint: fingerprintOf('tenable', '112526', 'https://example.com'),
        cwe: 'CWE-693',
        discoveredAt: minutesAgo(1465),
        lastSeenAt: minutesAgo(26),
      },
      {
        siteId: verifiedSite.id,
        scannerId: tenable.id,
        firstScanId: previousTenableScan.id,
        lastScanId: previousTenableScan.id,
        title: 'TLS 1.0 is enabled',
        description: 'The server still negotiates TLS 1.0, which is deprecated.',
        severity: 'high',
        category: 'compliance',
        location: 'https://example.com',
        fingerprint: fingerprintOf('tenable', '104743', 'https://example.com'),
        status: 'closed',
        discoveredAt: minutesAgo(1465),
        lastSeenAt: minutesAgo(1465),
        solvedAt: minutesAgo(26),
        updatedAt: minutesAgo(26),
      },
      {
        siteId: verifiedSite.id,
        scannerId: tenable.id,
        firstScanId: tenableScan.id,
        lastScanId: tenableScan.id,
        title: 'Directory listing enabled on /assets',
        description: 'Reported by the scanner, but the path is a public CDN mirror.',
        severity: 'low',
        category: 'security',
        location: 'https://example.com/assets',
        fingerprint: fingerprintOf('tenable', '40984', 'https://example.com/assets'),
        status: 'false_positive',
        discoveredAt: minutesAgo(26),
        lastSeenAt: minutesAgo(26),
        updatedAt: minutesAgo(20),
      },
    ]);

  console.log('Seeded');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
