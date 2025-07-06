const ApkBuilder = {
  isBindOn: false,
  build(config) {
    if (this.isBindOn) return;
    $("#export-apk-content").clear();
    // 处理路径
    const pathPrefix = Path.resolve(Path.dirname(Editor.config.project), "apk");
    const list = Object.keys(config);
    list.forEach((v) => {
      if (typeof config[v] === "string" && config[v]?.startsWith("@")) {
        config[v] = Path.resolve(__dirname, "Apk", config[v].replace("@", "."));
      } else if (typeof config[v] === "string" && config[v]?.startsWith("$")) {
        config[v] = Path.resolve(pathPrefix, config[v].replace("$", "."));
      } else if (typeof config[v] === "string" && config[v]?.startsWith("~")) {
        config[v] = Path.resolve(Path.dirname(Editor.config.project), config[v].replace("~", "."));
      }
    });
    config.projectPath = Path.dirname(Editor.config.project)
    if (!this.isBindOn) {
      require("electron").ipcRenderer.on("apk-log", this.apkLog);
    }
    require("electron").ipcRenderer.invoke("build-apk", config);
    this.isBindOn = true;
  },
  apkLog(event, log) {
    const text = document.createElement("text");
    text.textContent = log.msg;
    text.addClass("export-apk-major");
    $("#export-apk-content").appendChild(text);
    if (log.done) {
      console.log("done", log);
      this.isBindOn = false;
      $("#export-apk-button").enable();
    }
    $("#export-apk-container").scrollTo({
      top: $("#export-apk-container").scrollHeight,
    });
  },
};
