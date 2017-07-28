
/*
 * 
 * Array to Map transform a object array to tree form.
 * Here is example.
 * 
 var data1 = [
 {id: 1, name: 'Ali', lastname: 'A', birthdate: '31.19.1978', parent_id: null},
 {id: 2, name: 'Veli', lastname: 'B', birthdate: '31.19.1978', parent_id: 1},
 {id: 3, name: 'Deli', lastname: 'C', birthdate: '31.19.1978', parent_id: 1},
 {id: 4, name: 'Recep', lastname: 'D', birthdate: '31.19.1978', parent_id: 2},
 {id: 5, name: 'Ramazan', lastname: 'E', birthdate: '31.19.1978', parent_id: 2},
 {id: 6, name: 'Murtaza', lastname: 'F', birthdate: '31.19.1978', parent_id: 4},
 {id: 7, name: 'Barbar', lastname: 'G', birthdate: '31.19.1978', parent_id: null},
 {id: 8, name: 'Taha', lastname: 'H', alt: [1, 2, 3, 4], birthdate: '31.19.1978', parent_id: 7},
 {id: 9, name: 'dsfsdf', lastname: 'I', birthdate: '31.19.1978', parent_id: 8},
 {id: 11, name: 'sdfdsfdsf', lastname: 'J', birthdate: '31.19.1978', parent_id: 8},
 {id: 12, name: 'sdfdsfsdfds', lastname: 'K', birthdate: '31.19.1978', parent_id: 1},
 {id: 13, name: 'Paha', lastname: 'L', birthdate: '31.19.1978', parent_id: null}
 ];
 
 var data2 = mm7.array.toMap.transform(data1,"id","parent_id");
 data2 will be as below. So it is easy too use with commonn Jquery tree plugins.
 [
 {id: 1, name: 'Ali', lastname: 'A', birthdate: '31.19.1978', parent_id: null, subArray: [
 {id: 2, name: 'Veli', lastname: 'B', birthdate: '31.19.1978', parent_id: 1, subArray: [
 {id: 4, name: 'Recep', lastname: 'D', birthdate: '31.19.1978', parent_id: 2, subArray: [
 {id: 6, name: 'Murtaza', lastname: 'F', birthdate: '31.19.1978', parent_id: 4, subArray: []}
 ]},
 {id: 5, name: 'Ramazan', lastname: 'E', birthdate: '31.19.1978', parent_id: 2, subArray: []}
 ]},
 {id: 3, name: 'Deli', lastname: 'C', birthdate: '31.19.1978', parent_id: 1, subArray: []},
 {id: 12, name: 'sdfdsfsdfds', lastname: 'K', birthdate: '31.19.1978', parent_id: 1, subArray: []}
 ]},
 {id: 7, name: 'Barbar', lastname: 'G', birthdate: '31.19.1978', parent_id: null, subArray: [
 {id: 8, name: 'Taha', lastname: 'H', alt: [1, 2, 3, 4], birthdate: '31.19.1978', parent_id: 7, subArray: [
 {id: 9, name: 'dsfsdf', lastname: 'I', birthdate: '31.19.1978', parent_id: 8, subArray: []},
 {id: 11, name: 'sdfdsfdsf', lastname: 'J', birthdate: '31.19.1978', parent_id: 8, subArray: []}
 ]}
 ]},
 {id: 13, name: 'Paha', lastname: 'L', birthdate: '31.19.1978', parent_id: null, subArray: []}
 ];
 */


(function (mm7) {

    mm7["array"] = {};

    mm7["array"]["toMap"] = {
        data: null,
        subArrayTagName: "subArray",
        transform: function (objectArray, masterKey, detailKey, onReplace) {
            this.data = objectArray;
            return this.arrayToMap(this.data, masterKey, detailKey, onReplace);
        },
        subArray: function (a, f, v) {
            var arr = new Array();
            for (var i = 0; i < a.length; i++) {
                if (a[i][f] == v)
                    arr.push(a[i]);
            }
            return arr;
        },
        arrayToMap: function (d, mF, cF, r) {
            var arr = new Array();
            for (var i = 0; i < d.length; i++) {
                var item = d[i];
                if (this.subArray(d, mF, d[i][cF]).length === 0) {
                    item[this.subArrayTagName] = this.arrayToMap(this.subArray(this.data, cF, d[i][mF]), mF, cF);
                    if (typeof r === "fuction")
                        arr.push(r(item));
                    else
                        arr.push(item);
                }
            }
            return arr;
        }

    };

    mm7["array"]["shuffle"] = function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };
    
    mm7["array"]["indexOf"] = function(array,item) {
        for(var i=0; i<array.length; i++) {
            if (array[i] === item) return i;
        }
        return -1;
    };


})(mm7);