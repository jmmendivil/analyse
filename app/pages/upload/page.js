var app = require("../../app");

module.exports = function() {
	var nextPage = Array.prototype.slice.call(arguments);
	document.title = "upload";
	$("body").html(require("./application.jade")());
	$(".children").hide();
	$(".modal").modal({show: true});
	$("#file").change(loadFromFile);
	$("#example").click(loadFromExample);

	function loadFromExample() {
		require(["./example.json"], function(example) {
			app.load(example);
			$(".modal").modal("hide");
			app.loadPage.apply(app, nextPage);
		});
	}

	function loadFromFile() {
		var files = $("#file")[0].files;
		var fileReader = new FileReader();
		fileReader.readAsText(files[0]);
		fileReader.onload = function() {
			var data = JSON.parse(fileReader.result);

			if (!data.assets && !data.modules && data.children.length > 1) {
				var children = [];
				data.children.forEach(function(val, i) {
					var name = val.chunks[0].names[0] || "Build #" + (i+1);
					children.push("<option>" + name + "</option>");
				})
				$(".children")
					.find("select")
					.append(children)
					.on("change", function () {
						var index = this.selectedIndex - 1;
						loadStats(data.children[index]);
					})
					.end()
					.fadeIn();
			} else { loadStats(data); }
		};
		fileReader.onerror = function(err) {
			alert(err);
		};
	}

	function loadStats(stats) {
		app.load(stats);
		$(".modal").modal("hide");
		app.loadPage.apply(app, nextPage);
	}
};
