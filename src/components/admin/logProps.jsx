import React from "react";

export default function(WrappedComponent) {
    return class extends React.Componet {
        /*componentDidMount() {
            console.log(this.constructor.name + ' did mount');
        };*/
        componentDidUpdate(prevProps) {
            console.log('Current props: ', this.props);
            console.log('Previous props: ', prevProps);
        }
        render() {
            return <WrappedComponent {...this.props} />;
        }
    }
};