//letters array
let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

// get the lowest and highest number for calculation
let smallestLetter = 'a';
let biggestLetter ='j';
let smallestNumber ='1';
let biggestNumber = '20';

// Dynamic table
let html = 
`<table>
    <thead>
        <tr>
        <td></td>
  `;

    for(let i=0; i < letters.length; i++){
         html += `
        <td class="letters"> ${letters[i]} </td>
        `;       
}

html += `</tr></thead>`;
html += `<tbody>`;

    for(let j=1; j <= 20; j++){
        html += `<tr>
        <th>${j}</th>
        `;

    for(let i=0; i < letters.length; i++){
        html += `
        <td>
        <input 
            class="cell-input" type="text" id="${letters[i] + j}" 
            onfocus="copyCellGlobal('${letters[i] + j}');" 
            onkeyup="cellKeyPress('${letters[i] + j}', event.key, event.type);" 
            onblur="cellKeyPress('${letters[i] + j}', event.key, event.type);">
        <p class="formula-output" id=formula-output-${letters[i] + j}></p>
        </td>       
        `;        
}

html += `</tr>`;
    }

html += `</tbody></table>`;
document.getElementById('container').innerHTML = html;

//to show what you type on the cell and show same value in textbox and cell

function cellKeyPress(id,key,type){

    if(id === 'global' && type === 'keyup'){
        if(currentlyFocusedID === undefined || currentlyFocusedID === null){
            return;
        }
        if(key.toLowerCase() === 'enter'){
            id = currentlyFocusedID;
            document.getElementById("global-cell").value="";
            document.getElementById("global-cell").blur();
            document.getElementById(currentlyFocusedID).classList.remove("input-cell-border");
            currentlyFocusedID = null;

        }else{
            document.getElementById(currentlyFocusedID).value=document.getElementById("global-cell").value;
            return;
        }
        }else{
            document.getElementById("global-cell").value=document.getElementById(id).value;
        }    
    

    let cellElement = document.getElementById(id);
    let formulaOutput = document.getElementById(`formula-output-${id}`);
   

    if(type === 'blur' || type === 'keyup' && key.toLowerCase() === 'enter'){
        let cellValue = document.getElementById(id).value;

        //store valid formula
        let resultValue = cellValue.match(/=(s|S)(u|U)(m|M)\([a-zA-Z]\d{1,2}:[a-zA-Z]\d{1,2}\)/);
        
        if(resultValue === null){
            // we are sure that the formula is valid
            cellElement.setAttribute('data-formula', 'false');
            cellElement.classList.remove('is-formula');
            formulaOutput.innerHTML = "";
        } else {
        // we are sure that the formula is valid
        cellElement.setAttribute('data-formula', 'true');


        // store cell id from formula [a1,a10]
        let cells = resultValue[0].match(/[a-zA-Z]\d{1,2}/g);

        //get smallest and biggest letter and same with number. (get index to be able to loop letter and match it with the number)

        let startLetter=cells[0].match(/[a-zA-Z]/)[0].toLowerCase();
        let endLetter=cells[1].match(/[a-zA-Z]/)[0].toLowerCase();

        console.log(endLetter);

        let startLetterIndex = letters.indexOf(startLetter);
        let endLetterIndex = letters.indexOf(endLetter);

        console.log(startLetterIndex);

        if(startLetterIndex > endLetterIndex){
            let templetter = startLetterIndex;
            startLetterIndex = endLetterIndex;
            endLetterIndex = templetter;
        }

        let startNumber =cells[0].match(/\d{1,2}/)[0];
        let endNumber =cells[1].match(/\d{1,2}/)[0];

        if(startNumber > endNumber){
            let tempNumber = startNumber;
            startNumber = endNumber;
            endNumber= tempNumber;


        }
        // calculate cells input

        let sum= 0;
        for(let i= startLetterIndex; i <= endLetterIndex; i++){
            for(let j=startNumber; j <= endNumber; j++){

                let targetCell = document.getElementById(`${letters[i] + j}`);
                let cellValue = document.getElementById(`${letters[i] + j}`).value;

            // condition on getting the current cell value
            if(targetCell === cellElement){
                sum=NaN;
                break;
            }else if(targetCell.getAttribute('data-formula') === 'true'){
                sum +=parseInt(targetCell.getAttribute('data-value'));
            }else if(isNaN(cellValue)){
                continue;
            }else if(cellValue.length === 0){
                continue;
            }else{
                sum+= parseInt(cellValue);
            }   

        }

    }
        // store value in computed formula so it can be used in other cells formula
        console.log(sum)
        cellElement.setAttribute('data-value', sum);
        cellElement.classList.add('is-formula');
        cellElement.blur();
        formulaOutput.innerHTML = sum;

        if(type === 'keyup' && key.toLowerCase() === 'enter'){
           
            document.getElementById("global-cell").value="";
            document.getElementById("global-cell").blur();
            cellElement.classList.remove("input-cell-border");
            currentlyFocusedID = null;
       
        }
    }
     
    }

}

let previousFocusedID;
let currentlyFocusedID;

// copy cell value into the input text value outside

function copyCellGlobal(id){

    document.getElementById("global-cell").value=document.getElementById(id).value;

    previousFocusedID = currentlyFocusedID;
    currentlyFocusedID = id;

    if(previousFocusedID != undefined){
        document.getElementById(previousFocusedID).classList.remove("input-cell-border");
        
    }
    document.getElementById(id).classList.add("input-cell-border");

}


// clear all cells 

function clearAll(){

    for(let i=0; i <= 9; i++){
       for(j=1; j <= 20; j++){

        let cellElement = document.getElementById(letters[i] + j);
        let formulaOutput = document.getElementById(`formula-output-${letters[i] +j}`);

           
            document.getElementById(letters[i] + j).value="";
            document.getElementById("global-cell").value="";
            cellElement.setAttribute('data-formula', 'false');
            cellElement.classList.remove('is-formula');
    
            formulaOutput.innerHTML = "";
            
       }
    }  
    alert("Clear all Data?");

}