import axiosInstance from './orgin';

export const getCourseList = () => {
	return new Promise((resolve, reject) => {
		axiosInstance.get('/courses').then((coursesData) => {
			const courses = coursesData.data;
			if (courses) {
				// console.log("lessons from backend", courses);
				resolve(courses);
			} else {
				reject(err);
			}
		});
	});
};

export const isCourseEnrolled = (token, courseId) => {
	return new Promise((resolve, reject) => {
		axiosInstance
			.post(`/courses/enrolled/${courseId}`, { token })
			.then((coursesData) => {
				const course = coursesData.data;
				if (course.length === 0) {
					// console.log("Courses from backend", course);
					resolve(false);
				} else if (course.length >= 0) {
					resolve(true);
				} else {
					reject(err);
				}
			});
	});
};

export const getStudentCourseList = (token) => {
	return new Promise((resolve, reject) => {
		// console.log('my course request');
		axiosInstance
			.post('/courses/enrolled', { token })
			.then((coursesData) => {
				const courses = coursesData.data;
				if (courses) {
					// console.log("Courses from backend", courses);
					resolve(courses);
				} else {
					reject(err);
				}
			})
			.catch((e) => {
				console.log('Here at get my course', e);
			});
	});
};

export const getSectionList = (courseId) => {
	return new Promise((resolve, reject) => {
		axiosInstance
			.post('/sections', { courseId })
			.then((sectionsData) => {
				const sections = sectionsData.data;
				if (sections) {
					// console.log("lessons from backend", sections);
					resolve(sections);
				} else {
					reject(err);
				}
			})
			.catch((e) => {
				console.log('Here at Get Section', e);
			});
	});
};

export const getLessonList = (sectionId) => {
	return new Promise((resolve, reject) => {
		axiosInstance.post('/lessons', { sectionId }).then((lessonsData) => {
			const lessons = lessonsData.data;
			if (lessons) {
				// console.log("lessons from backend", lessons);
				resolve(lessons);
			} else {
				reject(err);
			}
		});
	});
};

export const getCourse = (courseId) => {
	return new Promise((resolve, reject) => {
		axiosInstance.get(`course/:${courseId}`).then((courseData) => {
			const course = courseData.data;
			if (course) {
				// console.log("lessons from backend", course);
				resolve(course);
			} else {
				reject(err);
			}
		});
	});
};

export const getLesson = (lessonId) => {
	return new Promise((resolve, reject) => {
		axiosInstance.post(`lesson/:${lessonId}`).then((lessonData) => {
			const lesson = lessonData.data;
			if (lesson) {
				// console.log("lessons from backend", lesson);
				resolve(lesson);
			} else {
				reject(err);
			}
		});
	});
};
