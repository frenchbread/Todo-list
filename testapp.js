Tasks = new Mongo.Collection("tasks");
Lists = new Mongo.Collection("lists");

if (Meteor.isClient) {
    Session.set("tasks", "");
    Template.body.helpers({
        tasks: function () {
            var tasks;
            if (Session.get("tasks") == ""){
                tasks = Tasks.find({ list: ""});
            }else{
                tasks = Session.get("tasks");
            }

            return tasks;
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
                list: '',
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
            Tasks.update(this._id, {$set: {checked: !this.checked}});
        },
        "click .delete": function () {
            Tasks.remove(this._id);
        },
        "click .plus": function () {
            var l = Lists.find().fetch();
            var list = "<b>Move to list:</b><hr/>";
            $.each(l, function (i, v) {
                var id = v._id;
                list += "<li class='move to_" + id + "' id='" + id + "' val='"+ v.text+"'>" + v.text + "</li>";
            });
            list = "<ul>" + list + "</ul>";
            $('.lists.opn_' + this._id).toggle().html(list);
        },
        "click .move": function (e) {
            Tasks.update({
                    _id: this._id
                },
                {
                    $set:{ list: e.target.id }
                });
        },
        "click .openTab": function (e) {

            var tasks;
            if(e.target.id == "allTasks"){
                tasks = Tasks.find({}, {sort: {createdAt: -1}}).fetch();
                $('#pageTitle').html('All tasks');
            }else{
                tasks = Tasks.find({ list: e.target.id}).fetch();
                aList = Lists.find({ _id: e.target.id }).fetch();
                $('#pageTitle').html(aList[0].text + " list");
            }

            Session.set("tasks", tasks);

        }
    });
}