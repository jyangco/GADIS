import React, { Component } from 'react'

import Layout from '../components/Layout'
import  GISMap from './GISmap/Map'

export class Dashboard extends Component {

    render() {
        return (
            <Layout>
                <div className="section_map-gis">
                    <GISMap/>
                </div>
                <hr className="my-3" />
                <div className="section_graphs min-h-[85vh]">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis cursus mi nisi, eu aliquam libero ornare nec. Integer eget lobortis lorem. Sed sit amet pharetra neque, a vestibulum lorem. Nam at ipsum eget elit porta condimentum. Phasellus at vestibulum felis. Nam ornare tristique dapibus. Cras auctor faucibus est, ut tempus lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam nisi magna, semper et felis a, aliquam lobortis nisl. Quisque tempus volutpat bibendum. Proin nec erat luctus, mollis sapien sed, luctus ante. Nulla eleifend, nunc at euismod ornare, orci tellus malesuada massa, non condimentum tellus ex quis libero. Vestibulum pellentesque ut massa varius sollicitudin. Aenean tempus leo et feugiat placerat. Quisque quis volutpat urna.</p> <br />
                    <p>Sed fringilla metus ut euismod pellentesque. Praesent tempor lorem quis dictum maximus. Integer sed libero metus. Aliquam erat volutpat. Donec consectetur dignissim lectus, ut tempus nibh malesuada et. Donec ut sodales libero, id suscipit velit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce sapien arcu, pellentesque vel molestie mattis, laoreet interdum neque. Nullam vel metus eget ante efficitur scelerisque et quis tortor. Duis efficitur tincidunt lectus, at efficitur quam condimentum non. Curabitur elementum neque dui, ornare faucibus libero elementum rhoncus. Donec sit amet ex at neque varius tristique. Integer lacus magna, tempor non sapien ac, lobortis tempus arcu. Integer suscipit erat et velit rutrum aliquet. Nulla ac dolor lorem.</p> <br />
                    <p>Ut hendrerit nisl in enim sagittis viverra eu a purus. Duis laoreet libero sed sagittis posuere. Mauris volutpat est sit amet libero varius, in faucibus lorem fringilla. Ut sollicitudin mi a erat scelerisque volutpat et non nisl. Ut semper eleifend rhoncus. Curabitur mollis aliquam nunc, ac ullamcorper libero ullamcorper at. Praesent convallis, sapien et tempor imperdiet, purus tortor vehicula ligula, ut posuere libero leo sed mauris. Suspendisse potenti. Proin ornare suscipit euismod. Fusce sagittis dui non lacus finibus dictum. Morbi auctor blandit elit, eu interdum sapien fringilla et. Vestibulum vitae ex et justo tincidunt ultricies.</p> <br />
                    <p>Maecenas aliquet arcu a sollicitudin vehicula. In aliquam arcu eget sodales fringilla. Nulla eget iaculis enim. Curabitur rutrum, nunc in sollicitudin imperdiet, quam mauris varius nunc, sit amet blandit est odio ac neque. Vivamus vulputate, ante nec maximus eleifend, odio risus pharetra arcu, id lobortis turpis turpis et erat. Donec in purus mi. Vivamus quis feugiat leo. Maecenas nec enim sed diam vehicula facilisis. Donec eleifend, elit quis gravida eleifend, lectus ex suscipit mi, ac fringilla nibh erat interdum ligula. Nullam tincidunt quam eu massa commodo efficitur. In ultricies, mi sed rutrum aliquet, neque felis interdum sem, at imperdiet nisi magna sed lectus. Nunc malesuada elementum massa, id tristique metus tempus in. Cras feugiat lacus vel lacinia viverra. Curabitur in leo interdum lacus posuere ultrices. Curabitur pulvinar dictum orci.</p> <br />
                    <p>Duis condimentum commodo purus et consequat. Phasellus vel elementum nisl, vitae cursus lorem. Suspendisse dignissim nisl id felis luctus blandit. Curabitur pulvinar, est non vehicula tempor, ligula lacus fringilla odio, egestas lobortis augue nunc id tellus. Donec leo sapien, ultricies pretium mattis eget, gravida non sapien. Maecenas bibendum, metus id eleifend placerat, eros quam ultricies mi, ac tincidunt quam nisl a quam. Sed elit erat, rutrum eget odio non, dictum consectetur ante. Nulla sit amet volutpat risus. Aliquam erat volutpat.</p> <br />
                </div>
            </Layout>
        )
    }
}

export default Dashboard