export interface ITemplateComposeOptions{
    sources:ITemplateSources[]
    base_source:string,  
    base_props:any,
    final_target:string
}

export interface ITemplateSources{
    separator:string,
    templateName:string,
    templateSources:ITemplateSource[]
}

export interface ITemplateSource{
    fileSource:string    
}

