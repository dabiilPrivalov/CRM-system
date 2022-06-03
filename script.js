(() => {

  const form = document.getElementById('form');
  const surname = document.getElementById('surname');
  const name = document.getElementById('name');
  const middlename = document.getElementById('middlename');
  const yearBorn = document.getElementById('yearBorn');
  const yearStudied = document.getElementById('yearStudied');
  const faculty = document.getElementById('faculty');
  const table = document.getElementById('table');

  let studentsArr;
  let completeCounter = 0;

  if (localStorage.getItem('key')) {
    studentsArr = JSON.parse(localStorage.getItem('key'));
    console.log(studentsArr);
    renderList(studentsArr);
  } else {
    studentsArr = [];
  }

  function createStudentObject() {
    const studentObj = {};
    const surnameValue = surname.value;
    const nameValue = name.value;
    const middlenameValue = middlename.value;
    const yearBornValue = yearBorn.value;
    const yearStudiedValue = yearStudied.value;
    const facultyValue = faculty.value;
    let studentAge;
    let course;

    const today = new Date().toLocaleDateString();
    const todayDateParts = today.split('.');
    const todayDay = todayDateParts[0];
    const todayMonth = todayDateParts[1];
    const todayYear = todayDateParts[2];

    const dateParts = yearBornValue.split('-');
    const userDate = yearBorn.valueAsDate;
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];

    

    //проверка фамилии
    if (/[0-9]/.test(surnameValue) || surnameValue.trim().length < 2) {
      surname.closest('label').querySelector('.error').classList.remove('block');
    } else {
      surname.closest('label').querySelector('.error').classList.add('block');
      studentObj.surname = surnameValue;
    }

    //проверка имени
    if (/[0-9]/.test(nameValue) || nameValue.trim().length < 2) {
      name.closest('label').querySelector('.error').classList.remove('block');
    } else {
      name.closest('label').querySelector('.error').classList.add('block');
      studentObj.name = nameValue;
    }

    //проверка отчества
    if (/[0-9]/.test(middlenameValue) || middlenameValue.trim().length < 2) {
      middlename.closest('label').querySelector('.error').classList.remove('block');
    } else {
      middlename.closest('label').querySelector('.error').classList.add('block');
      studentObj.middlename = middlenameValue;
    }

    // проверка даты рождения
    if (!yearBornValue || year < 1900 || userDate > new Date()) {
      yearBorn.closest('label').querySelector('.error').classList.remove('block');
    } else {
      yearBorn.closest('label').querySelector('.error').classList.add('block');
      studentObj.yearborn = yearBornValue;
    }

    // вычисление возраста
    studentAge = todayYear - year;
    if (month >= todayMonth && day >= todayDay) {
      studentAge -= 1;
    }
    studentObj.age = studentAge;

    //проверка года поступления
    if (!yearStudiedValue || yearStudiedValue.trim().length !== 4 || yearStudiedValue < 2000 || yearStudiedValue > todayYear) {
      yearStudied.closest('label').querySelector('.error').classList.remove('block');
    }
    else {
      yearStudied.closest('label').querySelector('.error').classList.add('block');
      studentObj.yearstudied = yearStudiedValue;
      // проверка курса
      course = todayYear - parseInt(studentObj.yearstudied.toString());
      studentObj.course = course;
      studentObj.yearFinish = (parseInt(studentObj.yearstudied) + 4).toString();
    }

    //проверка факультета
    if (/[0-9]/.test(facultyValue) || facultyValue.trim().length < 3) {
      faculty.closest('label').querySelector('.error').classList.remove('block');
     } else {
      faculty.closest('label').querySelector('.error').classList.add('block');
      studentObj.faculty = facultyValue;
    }

    let allBlockEl = document.querySelectorAll('.block');
    completeCounter = Array.from(allBlockEl).length;
    return studentObj

  }

  function createStudentsArray(studentObj) {
    if (studentObj.surname !== undefined && studentObj.name !== undefined && studentObj.middlename !== undefined && studentObj.yearborn !== undefined && studentObj.yearstudied !== undefined && studentObj.faculty !== undefined) {
      studentsArr.push(studentObj);
      saveArray(studentsArr);
      alert('Студент добавлен');
      return studentsArr
    } else {
      alert('Заполните поля');
    }
  }
  

  function clearInput() {
    surname.value = '';
    name.value = '';
    middlename.value = '';
    yearBorn.value = '';
    yearStudied.value = '';
    faculty.value = '';
  }

  function addStudents(e) {
    e.preventDefault();
    const object = createStudentObject();
    
    if (completeCounter == 6) {
      clearInput();
    }
    const studentArray = createStudentsArray(object);
    if (studentArray) {
      renderList(studentArray);
    }
  }

  function renderList(students){
    	table.innerHTML='';
      students.forEach(student=>{
        const tr = document.createElement('tr');
        const studentName = document.createElement('td');
        const studentYear = document.createElement('td');
        const studentStudie = document.createElement('td');
        const studentFaculty = document.createElement('td');

        studentName.textContent = `${student.surname}
        ${student.name} ${student.middlename}`;

        studentYear.textContent = `${student.yearborn
          .toString().split('-')
          .reverse()
          .join('.')} (${student.age.toString()} лет)`;

        const date = new Date();

        if (student.course > 4 || (student.course === 4 && (date.getMonth() + 1) > 9)) {
          studentStudie.textContent = `${student.yearstudied.toString()} - ${parseInt(student.yearstudied.toString()) + 4} закончил курс`;
        } else {
          studentStudie.textContent = `${student.yearstudied.toString()} - ${parseInt(student.yearstudied.toString()) + parseInt(student.course)} ${student.course} курс`;
        }

        studentFaculty.textContent = `${student.faculty}`;

        tr.append(studentName);
        tr.append(studentYear);
        tr.append(studentStudie);
        tr.append(studentFaculty);
        table.append(tr);
      })
    }

  function saveArray(array) {
    localStorage.setItem('key', JSON.stringify(array));
  }

  // сортировка
  const initialsSort = document.getElementById('initialsSort');
  const bornDateSort = document.getElementById('bornDateSort');
  const studiedDateSort = document.getElementById('studiedDateSort');
  const facultySort = document.getElementById('facultySort');

  function sortName() {
    studentsArr.sort((a, b) => {
      if ((a.surname + a.name + a.middlename) > b.surname + b.name + b.middlename) return 1;
      if ((a.surname + a.name + a.middlename) == b.surname + b.name + b.middlename) return 0;
      if ((a.surname + a.name + a.middlename) < b.surname + b.name + b.middlename) return -1;
    })
    renderList(studentsArr);
  }

  function sortFaculty() {
    studentsArr.sort((a, b) => {
      if (a.faculty > b.faculty) return 1;
      if (a.faculty < b.faculty) return -1;
      if (a.faculty == b.faculty) return 0;
    })
    renderList(studentsArr);
  }

  function sortBornDate() {
    studentsArr.sort((a, b) => {
      if (a.yearborn > b.yearborn) return 1;
      if (a.yearborn < b.yearborn) return -1;
      if (a.yearborn == b.yearborn) return 0;
    })
    renderList(studentsArr);
  }

  function sortStudiedDate() {
    studentsArr.sort((a, b) => {
      if (a.yearstudied > b.yearstudied) return 1;
      if (a.yearstudied < b.yearstudied) return -1;
      if (a.yearstudied == b.yearstudied) return 0;
    })
    renderList(studentsArr);
  }

  facultySort.addEventListener('click', sortFaculty);
  initialsSort.addEventListener('click', sortName);
  bornDateSort.addEventListener('click', sortBornDate);
  studiedDateSort.addEventListener('click', sortStudiedDate);


  // фильтры

  const initialFilter = document.getElementById('initialFilter');
  const studiedStartFilter = document.getElementById('studiedStartFilter');
  const studiedFinishFilter = document.getElementById('studiedFinishFilter');
  const facultyFilter = document.getElementById('facultyFilter');

  let filteredArray = [];

  function filterInitials() {
      filteredArray = studentsArr.filter(student =>
      student.name.toUpperCase().includes(initialFilter.value.toUpperCase()) ||
      student.surname.toUpperCase().includes(initialFilter.value.toUpperCase()) ||
      student.middlename.toUpperCase().includes(initialFilter.value.toUpperCase())
     );
    renderList(filteredArray);
  }

  function filterStudiedStart() {
    filteredArray = studentsArr.filter(student =>
      student.yearstudied.includes(studiedStartFilter.value.toString())
    );
    renderList(filteredArray);
  }

  function filterStudiedFinish() {
    filteredArray = studentsArr.filter(student =>
      student.yearFinish.includes(studiedFinishFilter.value.toString())
    );
    renderList(filteredArray);
  }

  function filterFaculty() {
    filteredArray = studentsArr.filter(student => student.faculty.toUpperCase().includes(facultyFilter.value.toUpperCase()));
    renderList(filteredArray);
  }

  initialFilter.addEventListener('input', filterInitials);
  studiedStartFilter.addEventListener('input', filterStudiedStart);
  studiedFinishFilter.addEventListener('input', filterStudiedFinish);
  facultyFilter.addEventListener('input', filterFaculty);

  form.addEventListener('submit', addStudents);

})();

