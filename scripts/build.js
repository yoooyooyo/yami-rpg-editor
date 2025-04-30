const fs = require("fs");
const path = require("path");
const { build } = require("electron-builder");

const buildConfig = JSON.parse(
  fs.readFileSync(path.join((__dirname, "./package.json")))
).build;

build({ config: buildConfig }).then(
  () => console.log("构建完成"),
  async (error) => {
    console.error("构建失败:", error);
  }
);
