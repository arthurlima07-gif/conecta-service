export declare const StatusConta: {
    readonly ATIVA: "ATIVA";
    readonly INATIVA: "INATIVA";
};
export type StatusConta = (typeof StatusConta)[keyof typeof StatusConta];
export declare const StatusPerfil: {
    readonly ATIVO: "ATIVO";
    readonly INATIVO: "INATIVO";
};
export type StatusPerfil = (typeof StatusPerfil)[keyof typeof StatusPerfil];
export declare const PapelUsuario: {
    readonly CONTRATANTE: "CONTRATANTE";
    readonly PRESTADOR: "PRESTADOR";
    readonly ADMINISTRADOR: "ADMINISTRADOR";
};
export type PapelUsuario = (typeof PapelUsuario)[keyof typeof PapelUsuario];
