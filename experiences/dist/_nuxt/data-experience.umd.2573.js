"use strict";(("undefined"!=typeof self?self:this).webpackChunkdata_experience=("undefined"!=typeof self?self:this).webpackChunkdata_experience||[]).push([[2573,1297],{82573:function(e,t,l){l.r(t),l.d(t,{default:function(){return d}});function r(code){switch(code){case"F":return"Female";case"M":return"Male";default:return code}}function n(code){switch(code){case"F":return"Women";case"M":return"Men";default:return code}}var o={mixins:[l(21297).default],data(){const[e]=this.values,{locale:t}=this.$i18n;return{slider:[e.ageFilterMin,e.ageFilterMax],items:[{title:"Birthdate",value:this.$d(new Date(e.birthDate),"dateOnly",t)},{title:"Gender",value:r(e.gender)},{title:"Education",value:e.education},{title:"College",list:!0,value:JSON.parse(e.college)},{title:"Interested In",value:n(e.interestedIn)},{title:"Sexual Orientations",list:!0,value:JSON.parse(e.sexualOrientations)},{title:"Gender Filter",value:r(e.genderFilter)},{title:"Account Creation",value:this.$d(new Date(e.createDate),"long",t)}],...e,descriptors:JSON.parse(e.descriptors)||[]}}},d=(0,l(1001).Z)(o,(function(){var e=this,t=e._self._c;return t("VRow",[t("VCol",{attrs:{cols:"12",align:"center"}},[t("VCard",{attrs:{"max-width":"600px"}},[t("VCardText",[t("VRow",[e._l(e.items,(function({title:title,value:l,list:r}){return t("VCol",{key:title,attrs:{cols:"12",md:"6"}},[t("div",{staticClass:"overline"},[e._v(" "+e._s(e.messages.titles?.[title])+" ")]),l&&0!==l.length?r?t("div",[t("div",{staticClass:"d-flex flex-column flex-md-row flex-wrap"},e._l(l,(function(l){return t("VChip",{key:l,staticClass:"ma-2",attrs:{label:""}},[e._v(" "+e._s(l)+" ")])})),1)]):t("p",{staticClass:"font-weight-bold"},[e._v(" "+e._s(e.messages.values?.[l]||l)+" ")]):t("p",{staticClass:"font-weight-bold",domProps:{textContent:e._s(e.messages["Not mentioned"])}})])})),e.ageFilterMin&&e.ageFilterMax?t("VCol",{attrs:{cols:"12"}},[t("div",{staticClass:"overline",domProps:{textContent:e._s(e.messages["Age filter"])}}),t("VRangeSlider",{staticClass:"pt-10 pr-10 pl-10",attrs:{"thumb-color":"primary","thumb-label":"always","thumb-size":"25",color:"primary",min:e.ageFilterMin-20,max:e.ageFilterMax+20,readonly:""},model:{value:e.slider,callback:function(t){e.slider=t},expression:"slider"}})],1):e._e(),e.descriptors.length?t("VCol",{attrs:{cols:"12"}},[t("div",{staticClass:"overline",domProps:{textContent:e._s(e.messages.Descriptors)}}),e._l(e.descriptors,(function({name:l,choices:r},n){return t("VRow",{key:n},[t("VCol",{attrs:{cols:"12"}},[t("VCard",{attrs:{outlined:""}},[t("VRow",[t("VCol",{attrs:{cols:"4"}},[t("VCardTitle",[e._v(e._s(l))])],1),t("VCol",{attrs:{cols:"8"}},[t("VCardText",[t("div",{staticClass:"d-flex flex-column flex-md-row flex-wrap"},e._l(r,(function(l){return t("VChip",{key:l,staticClass:"ma-2",attrs:{label:""}},[e._v(" "+e._s(l)+" ")])})),1)])],1)],1)],1)],1)],1)}))],2):e._e()],2)],1)],1)],1)],1)}),[],!1,null,null,null).exports},21297:function(e,t,l){l.r(t);var r=l(40290),n=l(18651),o=l(659);const d={props:{values:{type:Array,default:()=>[]},headers:{type:Array,default:()=>[]},messages:{type:Object,default:()=>({})}},data(){return{graphId:"graph_"+this._uid,totalCount:0,filterCount:0}},mounted(){this.drawViz()},watch:{values(){this.drawViz()}},methods:{drawViz(){},createTextFilterWidget(e,t="Search"){const l=new r.TextFilterWidget(e);return l.placeHolder(this.$tev(t,t)),l}}};t.default=(0,n.Z)(d,o.Z)}}]);