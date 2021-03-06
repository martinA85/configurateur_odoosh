window.onload = init;
var layout;
//function to add event listner on evry button
function init(){
  if(document.getElementById("is_configurable")){
    //all img of the document
    var clickable = document.getElementsByTagName("img");
    //setting printed price to product price
    price_out.innerHTML = parseInt(document.getElementById("prod_price").value);

    for(var i = 0; i < clickable.length; i++){

      //if img has class variant_img : we add the eventListener
      if(clickable[i].className.indexOf("variant_img") >= 0){
          clickable[i].addEventListener("click",clickOption);
      }
    }
    //all del_button (button on the summary tab)
     var clearBtn = document.getElementsByClassName("del-variant");
     for(b = 0; b<clearBtn.length;b++){

      clearBtn[b].addEventListener("click",clearConfig);
     }

    var product_details = document.getElementById("product_details");
    //this part remove product detail of the product page (no solution founded to do it in XML)
    for(var w = 0; w < product_details.childNodes.length; w++){
        product_details.remove(product_details[w]);
      }
    }
    
    layout = document.getElementById("choosen_layout").value;
    console.log(layout);
    
    setTabs();
}

//function executed on the click on a variant image
function clickOption(){
    element = this;
    // parent = parent div of the img (we use parentElement twice cause the img element is in a span generated by odoo)
    var parent = element.parentElement.parentElement.className;
    //childes = tabs that contain all variant img ()
    child = document.getElementById(parent);
    //this step delete active class of active variant and set her to unactive
    //child = <div><span><img></span><input hidden></div>
    //imgChild is the img in the div
    imgChild = this;
    classe = imgChild.classList;
    for(var i = 0; i<classe.length; i++){
        if(classe[i] == "active_var"){
          imgChild.classList.remove("active_var");
          imgChild.className += " unactive_var";
          imgChild.style = "border:none;width:100px;height:100px;";
        }
    }
    
    //step to set active the new active variant
    element.classList.remove("unactive_var");
    element.style = "width:100px;height:100px;";
    if(!element.classList.contains("active_var")){
      element.className += " active_var";
    }
    //call to update image function
    updateImage(element, parent);
    //moving the selected icon on the new active variant
    select_img = document.getElementById("selected_"+ parent);
    element.parentElement.parentElement.appendChild(select_img);
    //call to update config tab
    updateConfigTab(parent);
    update_price();
}

//this function update the configuration image
function updateImage(element, parent){

    select_name = "selected_"+ parent;
    //we are taking the parent div classname (variant.name)
    layer = element.parentElement.parentElement.className;
    //all layer have id : lay_variant.name
    layer = "lay_"+layer
    //div that contain background image and all layer
    backgroundDiv = document.getElementById("config_out");
    //list of all layer on the img
    backChilds = backgroundDiv.childNodes;
    //we set var img to null
    img = null;
    //generating src of the new variant simage
    newSrc = genSrc(element.src);
    //step to check if layer already exist
    for(var i =0; i<backChilds.length; i++){

      backChild = backChilds[i];
      backid = "lay_"+backChild.id;
      //if img exist : img = img of the layer
      if(backChild.id == layer){
        img = backChild.firstChild;
      }
    }
    //if img !=null, layer exist we change img src
    if(img != null){
      img.src = newSrc;
    }else{
        //generating the selected icon in the variant tabs
        selected_img = document.createElement("img");
        selected_img.style="position:absolute;margin:-73px 0px 0px 25px";
        selected_img.id=select_name;
        selected_img.className = "selected_variant_line";
        selected_img.src="http://imgshare.free.fr/uploads/aaea8347c8.png";
        //appending this img to selected variant div
        element.parentElement.parentElement.appendChild(selected_img);

        //generating layer's div and img
        divImg = document.createElement("div");
        divImg.id= layer;
        backgroundDiv.insertBefore(divImg, backgroundDiv.firstChild);
        layerImg = document.createElement("img");
        layerImg.style = "position:absolute; height:auto;z-index:1;";
        layerImg.src = newSrc;
        divImg.appendChild(layerImg);
      }
}

//this function generate the src of the variant img from the icon image
function genSrc(src){
    //src is the variant's icon image src : this function have to change the icon parameters of the url to image
    //src exemple http://ip:port/web/image/configurateur_product.line/22/icon?unique=6346df6
    splitC = src.split("?");
    newSrc = splitC[0].substr(0, splitC[0].length-4);
    newSrc = newSrc + "image?" + splitC[1];
    return newSrc;
}


// this function set href of the variant tabs menu (no solution do do it in XML)
function setTabs(){

  var tabs_menu = document.getElementById("tabs-menu").childNodes;
  for(t = 0; t<tabs_menu.length; t++){
    if(tabs_menu[t].nodeName == "LI"){

      variant_name = tabs_menu[t].childNodes[0].childNodes[0].innerHTML;
      tabs_menu[t].childNodes[0].href = "#"+variant_name; 
    }
  }
}

//update the configuration tab
function updateConfigTab(variant_name){
  
  configTab = document.getElementsByClassName("config_tab")[0];
  variant_tab = configTab.getElementsByClassName(variant_name)[0];
  //variant pannel (used to get active variant informations)
  variant_img = document.getElementById(variant_name).getElementsByClassName("active_var")[0];
  var_div = variant_img.parentElement.parentElement;
  
  extra = var_div.getElementsByClassName("variant_extra")[0].value;
  string = var_div.getElementsByClassName("variant_string")[0].value;
  
  variant_tab.getElementsByClassName("variant_str_recap")[0].innerHTML = string;
  variant_tab.getElementsByClassName("variant_extra_recap")[0].innerHTML = extra;
  
  if(layout == "v"){
    variant_tab.getElementsByClassName("variant_img_recap")[0].src = variant_img.src;
  }
  

}

//function that clear configuration (activated by del button on summary tab)
function clearConfig(){

  var variant_name = this.parentElement.childNodes[1].value;

  //first step : delete variant layer on the product image
  layer_name = "lay_"+variant_name;
  layer = document.getElementById(layer_name);
  layer.parentElement.removeChild(layer);

  //second step : delete variant info in summary tab
  //*this is the clicked button
  variant_tab = this.parentElement.parentElement.parentElement;
  variant_tab.getElementsByClassName("variant_str_recap")[0].innerHTML = "Vide";
  variant_tab.getElementsByClassName("variant_extra_recap")[0].innerHTML = " 0 ";
  
  if(layout == "v"){
    variant_tab.getElementsByClassName("variant_img_recap")[0].src = "/configOdoo/static/img/empty.png";
  }


  //third step : delete selected icon on variant image
  var active_variant = document.getElementsByClassName("active_var");

  for(a = 0;a<active_variant.length;a++){

    active_class = active_variant[a].parentElement.parentElement.classList;
    for(c=0;c<active_class.length;c++){
      if(active_class[c] == variant_name){
        active_variant_img = active_variant[a];

        //set to unactive the active img
        active_variant_img.classList.remove("active_var");
        active_variant_img.className += " unactive_var";
        
        //removing the selected icon
        active_parent = active_variant_img.parentElement.parentElement;
        active_parent.removeChild(active_parent.getElementsByClassName("selected_variant_line")[0]);
      }
    }
  }
  update_price();
}
//function to update the price of the product
function update_price(){
  //the original product price is stocked in a hiddent input
  price = parseInt(document.getElementById("prod_price").value);
  //price_out : span where price is going to be printed out
  price_out = document.getElementById("price_out");
  //list of all active variant img
  active_element = document.getElementsByClassName("active_var");
  //for each active variant
  for(e = 0; e < active_element.length; e++){
    //parent is the img parent div, this div contain an input who contain the extra price of the variant
    parent = active_element[e].parentElement.parentElement;
    extra_price = parent.childNodes[5].value;
    //adding extra price to product price
    price += parseInt(extra_price);
  }
  //we print the price in the price_out span
  price_out.innerHTML = price;
  setVariantString();
}


//this function change the + and - for the different material accordion
$(function() {
  $(".expand").on( "click", function() {
    // $(this).next().slideToggle(200);
    $expand = $(this).find(">:first-child");
    
    if($expand.text() == "+") {
      $expand.text("-");
    } else {
      $expand.text("+");
    }
  });
});

function setVariantString(){

  active_element = document.getElementsByClassName("active_var");
  var idList = "";
  for(f=0;f<active_element.length;f++){

    idList += active_element[f].parentElement.parentElement.childNodes[7].value +",";

  }
  document.getElementById('variant_lst').value = idList;
}
