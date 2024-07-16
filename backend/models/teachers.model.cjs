'use strict'

var sql = require('./connect.cjs')

// Teacher object constructor
var Teacher = function (teacher) {
    this.id = teacher.id
    this.fullName = teacher.fullName
    this.phone = teacher.phone
    this.department = teacher.department
    this.deviceManaged = teacher.deviceManaged
    this.departmentManaged = teacher.departmentManaged
    this.isTraining = Boolean(teacher.isTraining)
    this.isWorking = Boolean(teacher.isWorking)
}

Teacher.getAllTeachers = function (result) {
    sql.query('SELECT * FROM teacher_info', function (err, res) {
        if (err) {
            console.log('Error: ', err)
            result(err, null)
        } else {
            console.log('Teachers: ', res)
            result(null, res)
        }
    })
}

Teacher.addTeacher = function (newTeacher, result) {
    if (Array.isArray(newTeacher.deviceManaged)) {
        newTeacher.deviceManaged = newTeacher.deviceManaged.join(', ');
    }
    if (Array.isArray(newTeacher.departmentManaged)) {
        newTeacher.departmentManaged = newTeacher.departmentManaged.join(', ');
    }

    Object.keys(newTeacher).forEach(key => {
        if (newTeacher[key] === undefined || newTeacher[key] === null) {
            newTeacher[key] = '';
        }
    });

    const query = "INSERT INTO teacher_info SET ?";
    sql.query(query, newTeacher, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
}


Teacher.getTeacherById = function (teacherId, result) {
    sql.query("SELECT * FROM teacher_info WHERE ID = ?", [teacherId], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};



Teacher.updateById = function (id, teacher, result) {
    const { fullName, phone, department, deviceManaged, departmentManaged, isTraining, isWorking } = teacher;
    const sqlQuery = `
    UPDATE teacher_info 
    SET FullName = ?, Phone = ?, Department = ?, DeviceManaged = ?, DepartmentManaged = ?, isTraining = ?, isWorking = ? 
    WHERE ID = ?
  `;
    sql.query(sqlQuery, [fullName, phone, department, deviceManaged, departmentManaged, isTraining, isWorking, id], function (err, res) {
        if (err) {
            console.log("Error updating teacher:", err);
            result(err, null);
        } else {
            console.log("Teacher updated successfully");
            result(null, res);
        }
    });
};


Teacher.deleteTeacher = function (id, result) {
    sql.query("DELETE FROM teacher_info WHERE ID = ?", [id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};


Teacher.getCurrentId = function (result) {
    sql.query("SELECT MAX(CAST(REGEXP_REPLACE(ID, '[^0-9]', '') AS DECIMAL)) AS maxId FROM teacher_info", function (err, res) {
        if (err) {
            console.log('Error: ', err)
            result(err, null)
        } else {
            console.log('CurrentId: ', res)
            result(null, res[0])
        }
    })
}


module.exports = Teacher
