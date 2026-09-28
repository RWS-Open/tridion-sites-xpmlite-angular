export interface PageResponse{
    Id:string;
    Title:string;
    BluePrintInfo:{
        OwningRepository:{
            IdRef:string
        }
    }
}