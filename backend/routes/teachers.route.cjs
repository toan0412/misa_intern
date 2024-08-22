const express = require('express');
const router = express.Router();
const controller = require('../controllers/teachers.controller.cjs');

router.route('/')
    .get(controller.list_all_teachers)
    .post(controller.add_a_teacher);

router.route('/current-id')
    .get(controller.get_current_id);

router.route('/search')
    .get(controller.search_teachers);


router.route('/paged')
    .get(controller.list_limit_teachers);


router.route('/:teacherId')
    .get(controller.read_a_teacher)
    .put(controller.update_a_teacher)
    .delete(controller.delete_a_teacher);
module.exports = router;
