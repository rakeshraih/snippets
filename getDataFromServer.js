/*****Assumptions*****
1. Server holds data as an array of items, pageData = [];
2. Passing the aruments from the terminal, node getDataFromServer.js 5 51
3. Throwing the error then and there, rather than writing an error handler and handling it separately 
4. Use of ES6 syntax
5. Floating nos are rounded off
*******Assumption end ******/

const args = process.argv.slice(2);

// Validate arguments for valid input
if (!args || args.length < 2 || isNaN(args[1]) || isNaN(args[0])) {
  throw 'Pass valid integer arguments, Ex "node getDataFromServer.js 5 51"';
}

const minRange = parseInt(args[0]);
const maxRange = parseInt(args[1]);
if (minRange > maxRange || minRange < 0 || maxRange < 0) {
  throw 'Valid numbers, Min range > max range && > 0!';
}

/******Mocking server data start *******/
const pageData = [];
let i = 0;
while (i < 500) {
  pageData.push(`Records-${i++}`);
}
/******Mocking server data end *******/

const getPageFromServer = pageIndex => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        const intialIndex = pageIndex * 25;
        const finalIndex = intialIndex + 25;
        resolve(pageData.slice(intialIndex, finalIndex)); // Using slice to filter requested indexs from array
      }, Math.random() * 100); // Wrapping in setTimeout and adding random >=99ms delay to simulate server calls
    } catch (e) {
      reject('Error occurred while fetching');
    }
  });
};

// Method to convert range to pageIndex, 5-51 -to-> 0-3
const findPagesFromRange = (startIndex, endIndex) => {
  const startPage = Math.floor(startIndex / 25);
  const endPage = Math.floor(endIndex / 25);
  return [startPage, endPage];
};

// Generate array of promises getPageFromServer to be resolved later
const promiseRangeList = (startIndex, endIndex) => {
  const promiseList = [];
  while (startIndex <= endIndex) {
    promiseList.push(getPageFromServer(startIndex++));
  }
  return promiseList;
};

const getDataRangeFromServer = (startIndex, endIndex) => {
  return Promise.all(promiseRangeList(...findPagesFromRange(startIndex, endIndex)));
};

getDataRangeFromServer(minRange, maxRange)
  .then(responce => {
    console.log([].concat(...responce));
  })
  .catch(e => {
    console.log('Error on fetching data');
  });

// run as follows, range 0-500
// node getDataFromServer.js minRange maxRange
// node getDataFromServer.js 5 51
