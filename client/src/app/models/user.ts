export class User{
    constructor(
        //cuando defino prop en construc
        //me evito definirla
        //pasarle como parametro al constructor un datos
        //iniciarla o darle un valor

        public _id: string,
        public name: string,
        public surname: string,
        public nick:string,
        public email:string,
        public password: string,
        public role: string,
        public image: string
    ){}
}