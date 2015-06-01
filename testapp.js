Tasks = new Mongo.Collection("tasks");
Lists = new Mongo.Collection("lists");

if (Meteor.isClient) {
    Template.body.helpers({
        tasks: function () {
            return Tasks.find({}, {sort: {createdAt: -1}});
        },
        lists: function () {
            return Lists.find({}, {sort: {createdAt: -1}});
        }
    });

    Template.body.events({
        "submit .new-task": function (event) {

            var text = event.target.text.value;

            Tasks.insert({
                text: text,
                createdAt: new Date()
            });

            event.target.text.value = "";

            return false;
        },
        "click .delete1": function () {
            Lists.remove(this._id);
        },
        "submit .new-list": function (event) {
            var list = event.target.text.value;

            Lists.insert({
                text: list,
                createdAt: new Date()
            });

            event.target.text.value = "";

            return false;
        },
        "click .toggle-checked": function () {
            Tasks.update(this._id, {$set: {checked: ! this.checked}});
        },
        "click .delete": function () {
            Tasks.remove(this._id);
        }
    });
}