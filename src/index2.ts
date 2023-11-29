import axios from 'axios';

const asPromise = async (arr: number[]) => {
  await Promise.allSettled(
    arr.map(async (item) => {
      await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    })
  );
  console.log('AfterFirst');
  await Promise.allSettled(
    arr.map(async (item) => {
      for (let i = 0; i < 1e6; i++) {}
    })
  );

  console.log('After');
};

function createArray() {
  return new Array(20000).fill(0);
}

function prom() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('From promise');
      resolve('Ok');
    }, 1000);
  });
}

const arr = createArray();
console.log('Should be first');
asPromise(arr)
  .then(() => console.log('Done'))
  .catch((err) => console.log(err));
console.log('Should be second');
