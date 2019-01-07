export const PEOPLE = 'PEOPLE';

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
