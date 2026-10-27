import { publishScan } from "@/mq/scanPublisher";
import { exit } from "process";
console.log("Publishing test scans");
await publishScan("scans.test.requested", { foo: "bar" });
await publishScan("scans.test.requested", { foo: "dead" });
exit();