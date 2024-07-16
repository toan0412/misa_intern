module.exports = function (app) {
    var controller = require('../controllers/teachers.controller.cjs');

    app.route('/teachers')
        .get(controller.list_all_teachers)
        .post(controller.add_a_teacher);

    app.route('/teachers/:teacherId')
        .get(controller.read_a_teacher)
        .put(controller.update_a_teacher)
        .delete(controller.delete_a_teacher);

    app.route('/current-id')
        .get(controller.get_current_id);
};