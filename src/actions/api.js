export const PEOPLE = 'PEOPLE';
export const FAMILIES = 'FAMILIES';
export const STRINGS = 'STRINGS';

export const loadPeople = () => async (dispatch) => {
  fetch(`http://127.0.0.1:5000/people`)
    .then(resp => resp.json())
    .then(data => dispatch(getPeople(data)))
    .catch((error) => console.log(error));
};

export const loadFamilies = () => async (dispatch) => {
  fetch(`http://127.0.0.1:5000/families`)
    .then(resp => resp.json())
    .then(data => dispatch(getFamilies(data)))
    .catch((error) => console.log(error));
};

const getPeople = (data) => {
  return {
    type: PEOPLE,
    people: data
  };
};

const getFamilies = (data) => {
  return {
    type: FAMILIES,
    families: data
  };
};

const _strings = [
  "Birth Date",
  "Death Date",
  "Relationships",
  "People",
  "Families",
  "Dashboard",
  "Given name",
  "Surname",
  "Marriage Date",
  "Name",
  "Father",
  "Mother",
]

export const loadStrings = () => async (dispatch) => {
  fetch(`http://127.0.0.1:5000/translate?strings=` + JSON.stringify(_strings))
    .then(resp => resp.json())
    .then(data => dispatch(getStrings(data)))
    .catch((error) => console.log(error));
};

const getStrings = (data) => {
  return {
    type: STRINGS,
    strings: data
  };
};
