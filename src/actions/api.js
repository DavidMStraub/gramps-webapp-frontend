export const PEOPLE = 'PEOPLE';
export const STRINGS = 'STRINGS';

export const loadPeople = () => async (dispatch) => {
  fetch(`http://127.0.0.1:5000/people`)
    .then(resp => resp.json())
    .then(data => dispatch(getPeople(data)))
    .catch((error) => console.log(error));
};

const getPeople = (data) => {
  return {
    type: PEOPLE,
    people: data
  };
};

const _strings = [
  "Birth Date",
  "Death Date"
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
