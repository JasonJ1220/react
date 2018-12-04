/**
 * @file commonAction.jsx
 * @desc common Action
 * @author jinbo
 * @data 
 * @update 
 */

class commonAction extends Object {
    static async() {
        return (dispatch) => {
            let data = null;
            dispatch(commonAction.sync(data));
        }
    }
    static sync(data) {
        return {
            type: "xxx",
            data: data
        }
    }
}

export default commonAction;