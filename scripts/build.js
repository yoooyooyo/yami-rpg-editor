const cmd = require("child_process");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

function buildZip(type) {
  const output = fs.createWriteStream(
    path.join(__dirname, `../build/${type}.zip`)
  );
  const archive = archiver("zip", {
    zlib: { level: 9 }, // 压缩级别
  });

  output.on("close", function () {
    console.log(archive.pointer() + " total bytes");
    console.log("ZIP 已创建完成！");
  });

  archive.on("error", function (err) {
    throw err;
  });
  archive.directory(path.join(__dirname, `../build/${type}-unpacked`), type);
  archive.pipe(output);
  archive.finalize();
}

const types = {
  win: "electron-builder --dir --win --x64",
  linux: "electron-builder --dir --mac --x64 --no-symlink",
  mac: "electron-builder --dir --linux --x64",
  macArm64: "electron-builder --dir --mac --arm64 --no-symlink",
  universal: "electron-builder --dir --mac --universal",
};

const args = process.argv;

if (Object.keys(types).includes(args[2])) {
  const cmdStr = types[args[2]];
  cmd.exec(cmdStr).on("exit", () => {
    console.log("开始压缩...");
    buildZip("win");
  });
}
