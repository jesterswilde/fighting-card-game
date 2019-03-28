import {h, Component} from 'preact'; 
import { StoreState } from '../state/store';
import { dispatchToPathArray } from '../path/dispatch';
import { connect } from 'preact-redux';
import { FightingStyle, FightingStyleDescription } from '../fightingStyles/interface';
import {dispatchGetFightingStyleByName, dispatchGetFightingStyles} from '../fightingStyles/dispatch'
import Style from "./styleViewer/style"; 
import StyleNames from './styleViewer/styleNames'
import styleNames from './styleViewer/styleNames';


interface SelectorProps{
    styleDescriptions: FightingStyleDescription[],
    style: FightingStyle,
    isLoadingStyles: boolean,
    isLoadingStyle: boolean
}

interface ExternalProps{
    path: string[],
    pathPrepend: string[],
}

interface Props extends SelectorProps, ExternalProps{
}

const selector = (state: StoreState): SelectorProps=>{
    return {
        isLoadingStyle: state.fightingStyle.loadingStyle,
        isLoadingStyles: state.fightingStyle.loadingStyleNames,
        styleDescriptions: state.fightingStyle.styleDescriptions,
        style: state.fightingStyle.style,
    }
}

class StyleViewer extends Component<Props>{
    componentDidMount = ()=>{
        dispatchGetFightingStyles(); 
        if(this.props.path.length > 0){
            const styleName = this.props.path[1];
            if(styleName){
                dispatchGetFightingStyleByName(styleName); 
            }
        }

    }
    render = ()=>{ 
        const {path, pathPrepend, style, styleDescriptions, isLoadingStyle, isLoadingStyles} = this.props
        const viewingDeck = path.length > 0; 
        if(viewingDeck){
            return <Style isLoading={isLoadingStyle} {...style} back={()=>dispatchToPathArray(pathPrepend)} />
        }else{
            return <StyleNames styles={styleDescriptions} isLoading={isLoadingStyles} chooseStyle={this.chooseStyle}  />
        }
    }
    chooseStyle = (name: string)=>{
        dispatchToPathArray([...this.props.pathPrepend, 'deck', name]);
        dispatchGetFightingStyleByName(name); 
    }
}

export default connect(selector)(StyleViewer) as unknown as (props: ExternalProps)=> JSX.Element