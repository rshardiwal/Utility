jiraTcs = {
  sprintId: undefined,
  sprintNumber: undefined,
  teamName: undefined,
  csvFields: ["task_no", "story_point", "assignee", "task_description"],
  sprintContainer: function () {
    return $('div[data-sprint-id="' + this.sprintId + '"]');
  },
  getSprintId: function () {
    var self = this;
    var lookingForSprint = "Sprint " + this.sprintNumber + " " + this.teamName;
    let regexpForSprint = new RegExp(lookingForSprint, "i");
    $(".ghx-name").each(function (i, e) {
      var content = $(e).text().replace("(", "").replace(")", "");
      if (content.match(regexpForSprint)) {
        self.sprintId = $(e).closest(".ghx-backlog-header").data("sprint-id");
      }
    });
  },
  getTasks: function () {
    var $sprintContainer = this.sprintContainer();
    var tasks = [];
    $sprintContainer
      .find(".ghx-issues .ghx-backlog-card")
      .each(function (i, e) {
        var $backlogItem = $(e);
        var taskDescription = $backlogItem.find(".ghx-summary").text();
        var $endContainer = $backlogItem.find(".ghx-end");
        var taskAssignee = $endContainer.find("img.ghx-avatar-img").attr("alt");
        if (taskAssignee) {
          taskAssignee = taskAssignee.replace("Assignee: ", "");
        }
        var taskNo = $endContainer.find("a.ghx-key").text();
        var taskStoryPoint = $endContainer
          .find("span.ghx-statistic-badge")
          .text();
        tasks.push(
          [taskNo, taskStoryPoint, taskAssignee, taskDescription].join(",")
        );
      });
    return tasks;
  },
  exportCSV: function (csvData, filename) {
    var $sprintContainer = this.sprintContainer();
    csvData.unshift(this.csvFields.join(","));
    csvDataString = csvData.join("\r\n");
    var link = document.createElement("a");
    link.setAttribute(
      "href",
      "data:text/csv;charset=utf-8,%EF%BB%BF" +
        encodeURIComponent(csvDataString)
    );
    link.setAttribute("download", filename);
    $sprintContainer.find(".ghx-assigned-work-stats").append(link);
    link.click();
    $sprintContainer.find(".ghx-assigned-work-stats").remove(link);
  },
  download: function (sprintNumber, teamName, filename) {
    if (!filename) {
      filename = "team_task.csv";
    }
    this.sprintNumber = sprintNumber;
    this.teamName = teamName;
    this.getSprintId();
    if (!this.sprintId) {
      throw "I can't find the sprint ID";
      return;
    }
    var tasks = this.getTasks();
    this.exportCSV(tasks, filename);
  },
};
