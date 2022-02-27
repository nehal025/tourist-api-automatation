import React from 'react';


const divStyle = {
    display:'block',

    width: '50%',
    height: '100%',
    backgroundImage: `url('https://image.freepik.com/free-vector/communication-flat-icon_1262-18771.jpg')`,
    alignSelf: 'center' ,

};
const Component = () => {
    return (
        <div className="cComponent" style={divStyle} >
            <div className="logo">
            </div>
        </div>
    );
};

export default Component;