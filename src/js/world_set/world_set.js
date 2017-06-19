/* In some ways, this is the counterpart of world_get/world_get.js
*/
require("./../rur.js");
require("./../default_tiles/tiles.js");
require("./../programming_api/exceptions.js");
require("./../drawing/visible_world.js");
require("./../recorder/recorder.js"); // TODO: investigate if needed.
require("./../utils/key_exist.js");

var msg = require("./../../lang/msg.js");

RUR.world_set = {};

var set_dimension_form;


function trim_world (new_max_x, new_max_y, old_max_x, old_max_y) {
    var x, y, coords;
    // remove stuff from outside new boundaries

    for (x = new_max_x+1; x <= old_max_x; x++) {
        for (y = 1; y <= old_max_y; y++) {
            coords = x + "," + y;
            remove_all_at_location(coords);
        }
    }
    for (x = 1; x <= old_max_x; x++) {
        for (y = new_max_y+1; y <= old_max_y; y++) {
            coords = x + "," + y;
            remove_all_at_location(coords);
        }
    }
    if (RUR.CURRENT_WORLD.possible_initial_positions !== undefined) {
        delete RUR.CURRENT_WORLD.possible_initial_positions;
    }
    if (RUR.CURRENT_WORLD.goal !== undefined) {
        if (RUR.CURRENT_WORLD.goal.possible_final_positions !== undefined) {
            delete RUR.CURRENT_WORLD.goal.possible_final_positions;
        }
    }
}

function remove_all_at_location (coords) {
    // trading efficiency for clarity
    if (RUR.CURRENT_WORLD.tiles !== undefined) {
        if (RUR.CURRENT_WORLD.tiles[coords] !== undefined){
            delete RUR.CURRENT_WORLD.tiles[coords];
        }
    }
    if (RUR.CURRENT_WORLD.bridge !== undefined) {
        if (RUR.CURRENT_WORLD.bridge[coords] !== undefined){
            delete RUR.CURRENT_WORLD.bridge[coords];
        }
    }
    if (RUR.CURRENT_WORLD.decorative_objects !== undefined) {
        if (RUR.CURRENT_WORLD.decorative_objects[coords] !== undefined){
            delete RUR.CURRENT_WORLD.decorative_objects[coords];
        }
    }
    if (RUR.CURRENT_WORLD.obstacles !== undefined) {
        if (RUR.CURRENT_WORLD.obstacles[coords] !== undefined){
            delete RUR.CURRENT_WORLD.obstacles[coords];
        }
    }
    if (RUR.CURRENT_WORLD.pushables !== undefined) {
        if (RUR.CURRENT_WORLD.pushables[coords] !== undefined){
            delete RUR.CURRENT_WORLD.pushables[coords];
        }
    }
    if (RUR.CURRENT_WORLD.walls !== undefined) {
        if (RUR.CURRENT_WORLD.walls[coords] !== undefined){
            delete RUR.CURRENT_WORLD.walls[coords];
        }
    }
    if (RUR.CURRENT_WORLD.objects !== undefined) {
        if (RUR.CURRENT_WORLD.objects[coords] !== undefined){
            delete RUR.CURRENT_WORLD.objects[coords];
        }
    }
    if (RUR.CURRENT_WORLD.goal !== undefined) {
        if (RUR.CURRENT_WORLD.goal.walls !== undefined) {
            if (RUR.CURRENT_WORLD.goal.walls[coords] !== undefined){
                delete RUR.CURRENT_WORLD.goal.walls[coords];
            }
        }
        if (RUR.CURRENT_WORLD.goal.objects !== undefined) {
            if (RUR.CURRENT_WORLD.goal.objects[coords] !== undefined){
                delete RUR.CURRENT_WORLD.goal.objects[coords];
            }
        }
    }
}

msg.record_id("dialog-set-dimensions");
msg.record_title("ui-dialog-title-dialog-set-dimensions", "Set the world's dimensions");
msg.record_id("set-dimensions-explain", "set-dimensions-explain");
msg.record_id("input-max-x-text", "Maximum x value:");
msg.record_id("input-max-y-text", "Maximum y value:");
msg.record_id("use-small-tiles-text", "Use small tiles");

RUR.world_set.dialog_set_dimensions = $("#dialog-set-dimensions").dialog({
    autoOpen: false,
    height: 400,
    width: 500,
    modal: true,
    buttons: {
        OK: function () {
            set_dimension();
        },
        Cancel: function() {
            RUR.world_set.dialog_set_dimensions.dialog("close");
        }
    },
    close: function() {
        set_dimension_form[0].reset();
    }
});
function set_dimension () {
    "use strict";
    var max_x, max_y;
    max_x = parseInt($("#input-max-x").val(), 10);
    max_y = parseInt($("#input-max-y").val(), 10);
    RUR.CURRENT_WORLD.small_tiles = $("#use-small-tiles").prop("checked");

    trim_world(max_x, max_y, RUR.MAX_X, RUR.MAX_Y);   // remove extra objects
    RUR.set_world_size(max_x, max_y);
    RUR.world_set.dialog_set_dimensions.dialog("close");
    return true;
}
set_dimension_form = RUR.world_set.dialog_set_dimensions.find("form").on("submit", function( event ) {
    event.preventDefault();
    set_dimension();
});
