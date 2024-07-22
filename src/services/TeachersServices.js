// TeachersServices.js
import axios from './customize_axios'

const getAllTeachers = () => {
  return axios
    .get('/teachers')
    .then((response) => {
      console.log('Teachers fetched:', response)
      return response
    })
    .catch((error) => {
      console.error('Error fetching teachers:', error)
      throw error
    })
}

const getLimitTeachers = (limit, offset) => {
  const params = { limit, offset }
  return axios
    .get(`/paged`, { params })
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error('Error fetching teachers:', error)
      throw error
    })
}

const getTeacherBySearch = (searchTerm) => {
  return axios
    .get(`/search`, { params: { searchTerm } })
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error('Error fetching teachers:', error)
      throw error
    })
}

const getATeacher = (teacherId) => {
  return axios
    .get(`/teachers/${teacherId}`)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error('Error fetching teachers:', error)
      throw error
    })
}

const addTeacher = (newTeacher) => {
  return axios
    .post('/teachers', newTeacher)
    .then((response) => {
      console.log(`Teacher added successfully.`, response);
      return response.data;
    })
    .catch((error) => {
      console.error(`Error add teacher: `, error);
      throw error;
    });
}

const deleteTeacher = (teacherId) => {
  return axios
    .delete(`/teachers/${teacherId}`)
    .then((response) => {
      console.log(`Teacher with ID ${teacherId} deleted successfully.`, response);
      return response.data;
    })
    .catch((error) => {
      console.error(`Error deleting teacher with ID ${teacherId}:`, error);
      throw error;
    });
};

const editTeacher = (teacherId, updatedTeacher) => {
  return axios
    .put(`/teachers/${teacherId}`, updatedTeacher)
    .then((response) => {
      console.log(`Teacher with ID ${teacherId} updated successfully.`, response);
      return response.data;
    })
    .catch((error) => {
      console.error(`Error updating teacher with ID ${teacherId}:`, error);
      throw error;
    });
};

const getNextId = () => {
  return axios
    .get('/current-id')
    .then((response) => {
      const currentId = parseInt(response.maxId, 10) + 1;
      const nextId = 'NV' + currentId.toString().padStart(6, '0');
      return nextId;
    })
    .catch((error) => {
      console.error('Error getting currentId:', error)
      throw error
    })
}

export { getAllTeachers, deleteTeacher, addTeacher, editTeacher, getATeacher, getNextId, getLimitTeachers, getTeacherBySearch }
