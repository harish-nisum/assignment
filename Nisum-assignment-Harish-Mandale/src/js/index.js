import ReactDOM from 'react-dom';
import React from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader,Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from "reactstrap";

class ParentComponent extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div>
                {this.props.msgText}
                <ChildComponent showMsg={true}/>
            </div>
        );
    }
}

class ChildComponent extends React.Component {
    constructor(props) {
        super(props);
        this.count = 0;
        this.state = {
            messageNumber: ++this.count,
            showMsg: props.showMsg,
            products:{},
            isModelOpen: false,
            group: null,
        };
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount(){
        fetch(`http://localhost:3000/products`)
        .then((res) => {
            console.log(res);
            return res.json();
        })
        .then((res) => {
            console.log(res);
            this.setState((state) => ({...state,products:res}))})
        .catch((err) => (console.log("err")))
    }
    
    toggle() {
        this.setState((state) => ({...state, isModelOpen: !state.isModelOpen}));
    }

    handleHeroImageClick(group) {
        this.setState((state) => {
            return {...state,
                    group,
                    isModelOpen: !state.isModelOpen,
            };
        });
    }

    calculateDisplayCount() {
        let displaycardcount;
        if (window.innerWidth <= 600) {
            displaycardcount = 1;
        } else if ((window.innerWidth > 600) && (window.innerWidth <= 1000)) {
            displaycardcount = 2;
        } else {
            displaycardcount = 1;
        }
        return displaycardcount;
    }

    setTransform(){
        const { group } = this.state;
        this.slideWidth = -this.pos * this.item.offsetWidth;
        this.totalWidth = this.item.offsetWidth * childs.length;
        this.items.style.transform = `translate3d(${this.slideWidth}px,0,0)`;
    }


    transformRight(){
        const { childs } = this.props;
        const displaycardcount = this.calculateDisplayCount();
        this.pos = ((this.pos === (childs.length - displaycardcount)) ? 0 : (this.pos + 1));
        this.setTransform();
    }

    transformLeft(){
        const { childs } = this.props;
        const displaycardcount = this.calculateDisplayCount();
        this.pos = ((this.pos === 0) ? (childs.length - displaycardcount) : (this.pos - 1));
        this.setTransform();
    }

    render() {
        const {isModelOpen, products, group} = this.state;
        return (
        <div className="container">
            <Modal isOpen={isModelOpen} toggle={this.toggle} >
                <ModalHeader>{group && group.name}</ModalHeader>
                <ModalBody>
                    <Button
                        onClick={this.transformLeft}
                    >
                        {"<"}
                    </Button>
                   {group && group.images && group.images.map((image) => {
                    return(
                        <Card key={image.href}>
                            <CardImg top width="100%" src={image.href} alt="Thumbnail image" />
                        </Card>)
                    })}
                    <Button
                        onClick={this.transformRight}
                    >
                        {">"}
                    </Button>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="secondary"
                        onClick={this.toggle}
                    >
                        {"Close"}
                    </Button>
                </ModalFooter>
            </Modal>
            {products && products[0] && products[0].name}
            {products && products[0] && products[0].groups.map((group) => {
                return (<Card key={group.id}>
                    <CardImg top width="50%" src={`https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180`} alt="Card image cap" onClick={this.handleHeroImageClick.bind(this,group)}/>
                    <div>{group.name}</div>
                    <CardBody>
                        <CardTitle>{group.name}</CardTitle>
                        <CardSubtitle>type: {group.priceRange.type}</CardSubtitle>
                        <CardText>
                            <span>Price:</span>
                            <span>Regular: {group.priceRange.regular.high} - {group.priceRange.regular.low}</span><br/>
                            <span>Selling: {group.priceRange.selling.high} - {group.priceRange.selling.low}</span><br/>
                        </CardText>
                        <Button onClick={this.handleHeroImageClick.bind(this,group)}>{"Show thumbnail"}</Button>
                    </CardBody>
              </Card>)
            })}
        </div>
        );
    }
}
ReactDOM.render(<ParentComponent msgText="Products List" />, document.getElementById("app"));