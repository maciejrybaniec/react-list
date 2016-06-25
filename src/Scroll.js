import autobind from 'autobind-decorator';
//import cx from 'classnames';
import debounce from 'lodash/debounce';
import React, { PropTypes, Component } from 'react';

//import './Scroll.scss';

class Scroll extends Component {

    static propTypes = {
        listLength: PropTypes.number.isRequired,
        estimatedHeight : PropTypes.number.isRequired,
        getItem : PropTypes.func.isRequired
    };

    componentDidMount() {
        //super.componentDidMount();

        setTimeout(()=>{
            this.setState({
                offsetTop: 0,
                index: 0
            });
        }, 1000);
    }

    constructor(props) {
        super(props);

        this.contener = null;   //główny kontener, ten który ma scrolla
        this.child = {};

        this.state = {
            offsetTop: null,         //gdy null, to faza inicjowania
            index: null,
        };
    }
/*
gdy przesunięcie spowodowało że elementy są nadal widoczne
    to "przesuń" elementy między "czankami", pobierając wysokość elementów przesuwanych

gdy scroll spowodował że wyjechaliśmy za okno
    to wyznacz na nowo offsetTop

za każdym razem ustalaj na nowo wysokość głównego kontenera oraz tego czanka na dole
*/

/*
dwa rodzaje zdarzeń mają zachodzić
szybkie - bez debancingu, powodujące tylko odświeżenie duszków
wolne - majace narysować zawartość
 */
    render() {
        const offsetTop = this.state.index * this.props.estimatedHeight;
        const [indexList1, indexList2] = this._getIndex(this.state.index);

        //TODO
        //poustawiaj nowe indexy w obiekcie this.child

        const debugBox = (
            <div className="Scroll__debug">
                <div>chank z itemami ({this.state.offsetTop === null ? 'loading' : 'is load'}) -> {this.state.index}</div>
                <div>{this.firstChild ? this._getHeight(this.firstChild) : '--'}</div>
            </div>
        );
        
        return (
            <div className="Scroll" ref={this._getRef} onScroll={debounce(this._onScroll, 0)}>
                <div className="Scroll__top" style={{height: offsetTop+'px'}}>
                    <div className="Scroll__top-inner">
                        {indexList1.map(this._getItem)}
                    </div>
                </div>
                <div className="Scroll__bottom">
                    <div className="Scroll__bottom-inner">
                        {indexList2.map(this._getItem)}
                    </div>
                </div>
                {debugBox}
            </div>
        );
    }

    @autobind
    _onScroll() {

        const scrollTop = this.contener.scrollTop;
        const offsetTop = 0;
        const index = 0;

        //wylicz nowy offsetTop i index ...

        this.setState({
            offsetTop : offsetTop,
            index: index
        });
    }

    /*
    const index = this._findIndex();
    console.info('render', index, offsetTop, this.firstChild && this._getHeight(this.firstChild));
    */
    /*
    const styleInner = {
        height: (this.props.listLength * this.props.estimatedHeight) + 'px'
    };
    */
    //scrollTop: this.contener.scrollTop,

/*
    _findIndex() {

        if (this.contener === null) {
            return 0;
        }

        const all = this.contener.scrollHeight - this._getHeight(this.contener);

        const maxLength = this.props.listLength - 1;         //jeśli jest 10 elementów, to potrzebne są indexy od 0.00 do 9.00
        const wsk = (this.state.scrollTop * maxLength) / all;

        const index = Math.floor(wsk);

        return index;
    }
*/
    _getIndex(index) {
        const start = Math.max(index - 10, 0);
        const stop = Math.min(index + 10, this.props.listLength-1);

        const indexList1 = [];
        const indexList2 = [];

        for (let i=start; i<stop; i++) {
            if (i < index) {
                indexList1.push(i);
            } else {
                indexList2.push(i);
            }
        }

        return [indexList1, indexList2];
    }

    @autobind
    _getItem(index) {
        const ref = this._getRefChild.bind(this, index);

        return (
            <div key={index} ref={ref} style={{width: '100%'}}>
                {this.props.getItem(index)}
            </div>
        );
    }

    _getHeight(domElement) {
        const rect = domElement.getBoundingClientRect();
        return rect.bottom - rect.top;
    }

    @autobind
    _getRef(contener) {
        this.contener = contener;
    }

    @autobind
    _getRefChild(index, item) {
        this.child[index] = item;
    }
}

export default Scroll;
