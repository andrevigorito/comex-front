import React, {Component} from 'react'
// Images
import iconRgc from '../img/icons/rg-c.png'
import iconRgp from '../img/icons/rg-p.png'
import iconTotal from '../img/icons/total.png'
import iconTitleDash from '../img/icons/title-dash.png'
import iconUser from '../img/user-header.png'
import iconRemetente from '../img/icons/icon-nf-remetente.png'
import iconMap from '../img/icons/icon-nf-map.png'
import iconBarco from '../img/icons/icon-barco.png'
import iconAir from '../img/icons/icon-air.png'
import iconBack from '../img/icons/back.png'

// Components


class Detalhe extends Component {

    componentDidMount(){
        let acc = document.getElementsByClassName("accordion");
        let i;

        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function() {
                this.classList.toggle("active");
                let panel = this.nextElementSibling;
                if (panel.style.maxHeight){
                panel.style.maxHeight = null;
                } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
                } 
            });
        }
    }

	
    render(){
        return(

            <div>
                

                <div className="center">
                    <div className="page-header">
                        <h1>
                            <img src={iconTitleDash} alt="" />
                            Gerencial
                        </h1>
                        <div className="last-wrap">
                            <div className="btnvoltar" onClick={this.props.onRemoveProduct}>
                                <img src={iconBack} alt="" />
                                <p>Voltar</p>
                                
                            </div>
                        </div>
                    </div>

                    <div className="content-regerencial">
                        <div className="page-interna">
                            <header className="title" >
                                <div className="first">
                                    <p>ID: <strong>{this.props.product.product_id}</strong></p>
                                    <p>Produto: <strong>{this.props.product.product_description}</strong></p>
                                </div>
                                <div className="last">
                                    <p className="emp">{this.props.product.consignee.split(' ')[0]}</p>
                                </div>
                            </header>

                            <div className="boxgra">
                                <div className="first">
                                    <div className="tit">
                                        <img src={iconTitleDash} alt=""/>
                                        <p>GR Atual</p>
                                    </div>

                                    { 
                                        this.props.product.pos.map(po =>  
                                            po.po_items.map(item => 
                                                
                                                <div className={item.alert ? "item-gra alert": "item-gra"}  key={item.uuid}>
                                                    <p><img src={iconRgc} alt="" /> {new Date(item.eta_date).toLocaleDateString()}</p>
                                                    <p><img src={iconRgp} alt="" /> {item.qty.toLocaleString()}</p>
                                                </div>
                                            )
                                    )}

                                </div>
                                <div className="total">
                                    <img src={iconTotal} alt=""/>
                                    <p>Total: <strong>{this.props.product.pos.reduce((total, obj) => obj.qty + total,0).toLocaleString()}</strong></p>
                                </div>
                            </div>
                            
                            <div className="list-po">
                                <div className="header">
                                    <p className="w60">PO</p>
                                    <p className="w20">Qtd.</p>
                                    <p className="w20">Valor</p>
                                </div>

                                { 
                                    this.props.product.pos.map(accordion =>  
                                        accordion.po_items.map(item => 
                                    <div key={item.uuid}>
                                        <div className="item accordion" >
                                            <p className="w60">{item.bdp_ref}</p>
                                            <p className="w20">{item.qty}</p>
                                            <p className="w20">{item.invoice_value}</p>
                                        </div>
                                        <div className="panel">
                                            <div className="content-po ">
                                                <header>
                                                    <div className="gra">
                                                        <p>GR Atual</p>
                                                        <p> {item.gr_requested_date ? new Date(item.gr_requested_date).toLocaleDateString() : "-"}</p>
                                                    </div>
                                                    <div className="historico">
                                                        <div className="hist-tit">
                                                            <p>Último Histórico</p>
                                                            <p className="date">{item.last_update ? new Date(item.last_update).toLocaleDateString() : "-"}</p>
                                                        </div>
                                                        <div className="boll">
                                                            <span></span>
                                                        </div>
                                                        <div className="infouser">
                                                            <img src={iconUser} alt="" />
                                                            <div className="info">
                                                                <p className="user">Roberta Beltran</p>
                                                                <p>{item.notes}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </header>
                                                <div className="boxs">
                                                    <div className="box">
                                                        <div className="icon">
                                                            <img src={iconRemetente} alt="" />
                                                        </div>
                                                        <div className="info">
                                                            <div className="row">
                                                                <p>Item:</p>
                                                                <p>{item.item}</p>
                                                            </div>
                                                            <div className="row">
                                                                <p>QTD. Produto:</p>
                                                                <p>{item.qty}</p>
                                                            </div>
                                                            <div className="row">
                                                                <p>QTD. Container:</p>
                                                                <p>{item.container_qty}</p>
                                                            </div>
                                                            <div className="row">
                                                                <p>Peso:</p>
                                                                <p>{item.net_weight_kg} KG</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="box">
                                                        <div className="icon">
                                                            <img src={iconMap} alt="" />
                                                        </div>
                                                        <div className="info">
                                                            <div className="row">
                                                                <p>Origem:</p>
                                                                <p>{item.origin}</p>
                                                            </div>
                                                            <div className="row">
                                                                <p>Destino:</p>
                                                                <p>{item.destination}</p>
                                                            </div>
                                                            <div className="row">
                                                                <p>Transportador:</p>
                                                                <p>{item.carrier}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="box">
                                                        <div className="icon">
                                                        <img src={item.modal === "Ocean Import" ? iconBarco : iconAir} alt="" />
                                                        </div>
                                                        <div className="info">
                                                            <div className="row">
                                                                <p>ETD - Prev. Embarque:</p>
                                                                <p>{item.etd_date ? new Date(item.etd_date).toLocaleDateString() : "-"}</p>
                                                            </div>
                                                            <div className="row">
                                                                <p>ATD - Real. Embarque:</p>
                                                                <p>{item.ata_date ? new Date(item.ata_date).toLocaleDateString() : "-"}</p>
                                                            </div>
                                                            <div className="row">
                                                                <p>ETA - Prev. Entrega:</p>
                                                                <p> {item.eta_date ? new Date(item.eta_date).toLocaleDateString() : "-"}</p>
                                                            </div>
                                                            <div className="row">
                                                                <p>ATA - Real. Entrega:</p>
                                                                <p>{item.ata_date ? new Date(item.ata_date).toLocaleDateString() : "-"}</p>
                                                            </div>
                                                            <div className="row">
                                                                <p>Entrega na Planta:</p>
                                                                <p>29/03/2019</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                       
                                ))}
                                
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Detalhe;