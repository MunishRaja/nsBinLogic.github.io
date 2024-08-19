function addEventListenersToInputs(input) {
    input.addEventListener('keydown', function(event) {

        const currentRow = input.parentElement.parentElement;
        const currentCell = input.parentElement;
        let targetInput;

        switch (event.key) {
            case 'ArrowUp':
                if (currentRow.previousElementSibling) {
                    targetInput = currentRow.previousElementSibling.cells[currentCell.cellIndex].querySelector('input');
                }
                break;
            case 'ArrowDown':
                if (currentRow.nextElementSibling) {
                    targetInput = currentRow.nextElementSibling.cells[currentCell.cellIndex].querySelector('input');
                }
                break;
            case 'ArrowLeft':
                if (currentCell.previousElementSibling) {
                    targetInput = currentCell.previousElementSibling.querySelector('input');
                }
                break;
            case 'ArrowRight':
                if (currentCell.nextElementSibling) {
                    targetInput = currentCell.nextElementSibling.querySelector('input');
                }
                break;
            case 'Enter':
                addRow();
                break;
        }

        if (targetInput) {
            targetInput.focus();
            event.preventDefault(); // Prevent default arrow key behavior
        }
    });
}

function addRow() {
    // Get the table element
    var table1 = document.getElementById('inputTable');
    var table2 = document.getElementById('outputTable');

    // Create a new row
    var newRow1 = table1.insertRow();
    var newRow2 = table2.insertRow();

    // Create new cells
    var cell1 = newRow1.insertCell(0);
    var cell2 = newRow1.insertCell(1);
    var cell3 = newRow1.insertCell(2);
    var cell4 = newRow1.insertCell(3);
    var cell5 = newRow1.insertCell(4);

    var cell6 = newRow2.insertCell(0);
    var cell7 = newRow2.insertCell(1);
    var cell8 = newRow2.insertCell(2);
    var cell9 = newRow2.insertCell(3);
    var cell10 = newRow2.insertCell(4);

    // Add input fields to the new cells
    cell1.innerHTML = '<input type="text">';
    cell2.innerHTML = '<input type="text">';
    cell3.innerHTML = '<input type="text">';
    cell4.innerHTML = '<input type="number">';
    cell5.innerHTML = '<input type="date">';

    // Get the input elements in the new row
    var input1 = cell1.getElementsByTagName('input')[0];
    var input2 = cell2.getElementsByTagName('input')[0];
    var input3 = cell3.getElementsByTagName('input')[0];
    var input4 = cell4.getElementsByTagName('input')[0];
    var input5 = cell5.getElementsByTagName('input')[0];


    // Add event listeners to the new input fields
    addEventListenersToInputs(input1);
    addEventListenersToInputs(input2);
    addEventListenersToInputs(input3);
    addEventListenersToInputs(input4);
    addEventListenersToInputs(input5);

    // Set focus on the first input of the new row
    input1.focus();
}

function Bin(name, pallet, lot, qty, expiry) {
    this.bin = name;
    this.pallet = pallet;
    this.lot = lot;
    this.qty = qty;
    this.expiry = expiry;
  }

// Attach event listener to the initial inputs in the first row
var initialInputs = document.querySelectorAll('#inputTable input');
initialInputs.forEach(function(input) {
    addEventListenersToInputs(input);
});

document.getElementById('resetButton').onclick = function(){
    var rowCount = document.getElementById('inputTable').rows.length;

    for(var i = rowCount; i > 3; i--){
        document.getElementById('inputTable').deleteRow(i-1);
        document.getElementById('outputTable').deleteRow(i-1);
    }
}

document.getElementById("sortButton").onclick = function(){
    var targetQty = document.querySelector(".req").value;
    console.log("TARGET : "+ targetQty);
    var table = document.getElementById('inputTable');
    var tableValues = [];

    for(var i = 2, row; row = table.rows[i]; i++){
        var rowData = [];
        for(var j = 0, cell; cell = row.cells[j]; j++){

            var input = cell.querySelector('input');
            rowData.push(input.value);
        }

        var bin = new Bin(...rowData);

        tableValues.push(bin);
    }

    console.log(tableValues);
    
    tableValues.sort((a,b) => {
        if(a.qty == targetQty && b.qty != targetQty) return -1;
        if(a.qty != targetQty && b.qty == targetQty) return 1;
        if((a.qty == targetQty && b.qty == targetQty) || (a.qty != targetQty && b.qty != targetQty)){
            return new Date(a.expiry) - new Date(b.expiry)
        }
    });

    console.log("SORTED ARRAY : ",tableValues);

    var sumQty = 0;
    var initialArray = [];
    var remainingArray = [];

    for (let line of tableValues) {
        let qty = parseInt(line.qty);
        if (sumQty < targetQty) {
            sumQty += qty;
            initialArray.push(line);
        } else {
            remainingArray.push(line);
        }
    }

    remainingArray.sort((a, b) => {
        
        if(new Date(a.expiry) - new Date(b.expiry) == 0){
            var binA = parseInt(a.bin.match(/\d+/)[0]);
            var binB = parseInt(b.bin.match(/\d+/)[0]);
            return binA - binB;
        }
    });

    let finalArray = initialArray.concat(remainingArray);

    console.log(finalArray);

    let tableRows = document.querySelectorAll("#outputTable tbody tr");

    finalArray.forEach((obj, index) => {
        var cells = tableRows[index+1].children;

        let dateParts = obj.expiry.split('-');
        let formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    
        cells[0].textContent = obj.bin;
        cells[1].textContent = obj.pallet;
        cells[2].textContent = obj.lot;
        cells[3].textContent = obj.qty;
        cells[4].textContent = formattedDate;
    });
}