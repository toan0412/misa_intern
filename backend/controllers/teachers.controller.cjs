var Teacher = require('../models/teachers.model.cjs');

exports.list_all_teachers = function (req, res) {
    Teacher.getAllTeachers(function (err, teachers) {
        console.log('controller');
        if (err) {
            res.status(500).send(err);
        } else {
            const totalRecords = teachers.length;
            console.log('res', teachers);
            res.json({
                totalRecords: totalRecords,
                teachers: teachers
            });
        }
    });
};


exports.list_limit_teachers = function (req, res) {
    const limit = parseInt(req.query.limit, 10);
    const offset = parseInt(req.query.offset, 10);

    Teacher.getLimitTeachers(limit, offset, function (err, teachers) {
        if (err) {
            console.error('Error fetching teachers:', err);
            return res.status(500).send(err);
        }
        console.log('Fetched teachers:', teachers);
        res.json(teachers);
    });
};

exports.search_teachers = function (req, res) {
    const searchTerm = req.query.searchTerm;
    Teacher.searchTeacher(searchTerm, function (err, teachers) {
        if (err) {
            console.error('Error searching teachers:', err);
            return res.status(500).json({ error: true, message: 'Failed to search teachers', details: err });
        }
        const totalRecords = teachers.length;
        console.log('res', teachers);
        res.json({
            totalRecords: totalRecords,
            teachers: teachers
        });
    });
};



exports.add_a_teacher = function (req, res) {
    const new_teacher = new Teacher(req.body);

    if (!new_teacher.fullName || !new_teacher.id || !new_teacher.phone) {
        res.status(400).json({ error: true, message: 'Please provide needed information' });
    } else {
        Teacher.addTeacher(new_teacher, function (err, teacherId) {
            if (err) {
                res.status(500).json({
                    error: true,
                    message: "Failed to add teacher",
                    details: err.sqlMessage
                });
            } else {
                res.status(201).json({ success: true, teacherId });
            }
        });
    }
};

exports.read_a_teacher = function (req, res) {
    Teacher.getTeacherById(req.params.teacherId, function (err, teacher) {
        if (err)
            res.send(err);
        res.json(teacher);
    });
};


exports.update_a_teacher = function (req, res) {
    const id = req.params.teacherId;
    const updatedTeacher = req.body;

    Teacher.updateById(id, updatedTeacher, function (err, result) {
        if (err) {
            res.status(500).json({ error: true, message: "Failed to update teacher" });
        } else {
            res.status(200).json({ success: true, message: "Teacher updated successfully" });
        }
    });
};


exports.delete_a_teacher = function (req, res) {
    Teacher.deleteTeacher(req.params.teacherId, function (err, teacher) {
        if (err)
            res.send(err);
        res.json({ message: 'Teacher successfully deleted' });
    });
};

exports.get_current_id = function (req, res, err) {
    Teacher.getCurrentId(function (err, currentId) {

        if (err)
            res.send(err);
        console.log('res', currentId);
        res.send(currentId);
    });
};