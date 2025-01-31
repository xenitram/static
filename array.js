const array=function(){

//https://codeburst.io/javascript-array-distinct-5edc93501dc4
  const distinct=(value,index,self)=>{
	return self.indexOf(value)==index;
  }
  const unique2=(arr)=>arr.filter(distinct);

  const unique=(arr)=>[...new Set(arr)];


/*function extendData(data,val=0){
	x=[...data.x]
	x.unshift(x[0]+(x[0]-x[1]))
	x.push(x[x.length-1]+(x[x.length-1]-x[x.length-2]))

	y=[...data.y]
	y.unshift(y[0]+(y[0]-y[1]))
	y.push(y[y.length-1]+(y[y.length-1]-y[y.length-2]))

	thickness=[...data.thickness]
	thickness=thickness.map(a=>a.map(a1=>(a1!=0)?a1:val))
	thickness.unshift([...Array(thickness[0].length)].fill(val))
	thickness.push([...Array(thickness[0].length)].fill(val))
	thickness=thickness.map(a=>{
	a.unshift(val)
	a.push(val)
	return a;	
	})
	return {x,y,thickness}
}*/

function flatSanitize(thickness){
  let values=thickness.flat(Infinity);
  return values.filter(v=>v!=0)

}



function unflattenArray(flattenedArray, size) {
  const unflattenedArray = [];
  
  for (let i = 0; i < flattenedArray.length; i += size) {
    unflattenedArray.push(flattenedArray.slice(i, i + size));
  }
  
  return unflattenedArray;
}

function unflatten(arr,sizes) {
  sizes=(Array.isArray(sizes))?sizes:[sizes];
	  sizes.reverse().forEach((v,i)=>{
		arr=unflattenArray(arr,v)
	  }
  );
  return arr;
}
let flatten=(arr,level=Infinity)=>arr.flat(level);

const range = function (start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

const sequence = function (length,start=0){
	return Array.from(Array(length), (d, i) => i+start)
}


return {flatSanitize,flatten,unflatten,range,sequence,unique}

}();
