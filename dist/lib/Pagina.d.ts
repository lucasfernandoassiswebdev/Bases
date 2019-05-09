export declare class Paginavel {
    sort: any;
    offset: number;
    pageSize: number;
    pageNumber: number;
    unpaged: boolean;
    paged: boolean;
}
export declare class Pagina {
    content: any;
    pageable: Paginavel;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    sort: any;
}
export default Pagina;
