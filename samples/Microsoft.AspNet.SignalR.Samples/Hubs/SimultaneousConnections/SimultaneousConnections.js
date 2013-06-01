/// <reference path="../../Scripts/jquery-1.8.2.js" />
$(function () {
    "use strict";

    var numberCons = getQueryVariable('cons'),
        connections = [],
        messages = $("#messages"),
        addConnections,
        createConnection = function (rawConnection, id) {
            var connection;

            if (rawConnection) {
                connection = $.connection(rawConnection);
            }
            else {
                connection = $.hubConnection();
            }

            connection.logging = true;

            connection.reconnecting(function () {
                $("<li/>").html("connection" + id + " " + "[" + new Date().toTimeString() + "]: reconnecting").appendTo(messages);
            });

            connection.reconnected(function () {
                $("<li/>").css("background-color", "green")
                          .css("color", "white")
                          .html("connection" + id + " " + "[" + new Date().toTimeString() + "]: Connection re-established")
                          .appendTo(messages);
            });

            connection.error(function (err) {
                $("<li/>").html("connection" + id + " " + (err.responseText || err))
                          .appendTo(messages);
            });

            connection.disconnected(function () {
                $("#stopStart" + id)
                    .prop("disabled", false)
                    .find("span")
                        .text("Start Connection" + id)
                        .end()
                    .find("i")
                        .removeClass("icon-stop")
                        .addClass("icon-play");
            });

            connection.stateChanged(function (change) {
                var oldState = null,
                    newState = null;

                for (var state in $.signalR.connectionState) {
                    if ($.signalR.connectionState[state] === change.oldState) {
                        oldState = state;
                    }
                    if ($.signalR.connectionState[state] === change.newState) {
                        newState = state;
                    }
                }

                $("<li/>").html("connection" + id + " " + oldState + " => " + newState + " " + connection.id)
                          .appendTo(messages);
            });

            return connection;
        };

    addConnections = function (first, numberCons) {
        var connection, myHub, start;

        for (var i = first; i < first + numberCons; i++) {
            $("#connections").append("<p>");
            $("#connections").append(" <input type='text' id=" + "msg" + i + " value=" + i + i + i + " style='margin-bottom: 0' />");
            $("#connections").append("<input type='button' id=" + "broadcast" + i + " class='btn' value='Broadcast' />");
            $("#connections").append("<button id=" + "stopStart" + i + " class='btn' disabled='disabled'><span>Stop Connection" + i + "</span></button>");
            $("#connections").append("<label id=connection" + i + " style='display: inline' </label>");
            $("#connections").append("<br/><b>The latest message received: </b><label id=connectionMsg" + i + " style='display: inline' </label>");

            connection = createConnection("", i);

            myHub = connection.createHubProxy('hubConnectionAPI');

            start = function (j) {
                connections[j].myHub.on('displayMessage', function (value) {
                    $("<li/>").html("connection" + j + " " + value).appendTo(messages);

                    $("#connectionMsg" + j).text(value);
                });

                connections[j].connection.start({ transport: activeTransport, jsonp: isJsonp })
                    .done(function () {
                        $("#connection" + j).text(" " + connections[j].connection.id + " " + connections[j].connection.transport.name);

                        $("#stopStart" + j).val("Stop Connection").prop("disabled", false);

                        $("#broadcast" + j).click(function () {
                            connections[j].myHub.invoke("displayMessageAll", $("#msg" + j).val());
                        });

                        $("#stopStart" + j).click(function () {
                            var $el = $("#stopStart" + j);

                            $el.prop("disabled", true);

                            if ($.trim($el.find("span").text()) === "Stop Connection" + j) {
                                connections[j].connection.stop();
                            } else {
                                connections[j].start(j);
                            }
                        });
                    });
            };

            connections.push({ "number": i, "connection": connection, "myHub": myHub, "start": start });

            connections[i].start(i);
        }
    }

    addConnections(0, numberCons);

    $("#addCon").click(function () {
        addConnections(connections.length, 1);
    });

});


