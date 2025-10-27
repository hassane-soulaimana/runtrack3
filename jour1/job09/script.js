function tri(numbers, order) {
    const result = [...numbers];
    const count = result.length;
    
    
    for (let i = 0; i < count - 1; i++) {
        for (let j = 0; j < count - i - 1; j++) {
            let swap = false;
            
            if (order === "asc") {
                swap = result[j] > result[j + 1];
            } else if (order === "desc") {
                swap = result[j] < result[j + 1];
            } else {
                return false;
            }
          
            if (swap) {
                let temp = result[j];
                result[j] = result[j + 1];
                result[j + 1] = temp;
            }
        }
    }
    
    return result;
}


console.log(tri([3, 1, 4, 2], "asc"));
console.log(tri([3, 1, 4, 2], "desc"));