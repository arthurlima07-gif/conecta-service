import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type UsuarioModel = runtime.Types.Result.DefaultSelection<Prisma.$UsuarioPayload>;
export type AggregateUsuario = {
    _count: UsuarioCountAggregateOutputType | null;
    _avg: UsuarioAvgAggregateOutputType | null;
    _sum: UsuarioSumAggregateOutputType | null;
    _min: UsuarioMinAggregateOutputType | null;
    _max: UsuarioMaxAggregateOutputType | null;
};
export type UsuarioAvgAggregateOutputType = {
    idUsuario: number | null;
};
export type UsuarioSumAggregateOutputType = {
    idUsuario: number | null;
};
export type UsuarioMinAggregateOutputType = {
    idUsuario: number | null;
    nome: string | null;
    email: string | null;
    senhaHash: string | null;
    telefone: string | null;
    cpf: string | null;
    fotoPerfil: string | null;
    cidade: string | null;
    estado: string | null;
    dataCadastro: Date | null;
    statusConta: $Enums.StatusConta | null;
};
export type UsuarioMaxAggregateOutputType = {
    idUsuario: number | null;
    nome: string | null;
    email: string | null;
    senhaHash: string | null;
    telefone: string | null;
    cpf: string | null;
    fotoPerfil: string | null;
    cidade: string | null;
    estado: string | null;
    dataCadastro: Date | null;
    statusConta: $Enums.StatusConta | null;
};
export type UsuarioCountAggregateOutputType = {
    idUsuario: number;
    nome: number;
    email: number;
    senhaHash: number;
    telefone: number;
    cpf: number;
    fotoPerfil: number;
    cidade: number;
    estado: number;
    dataCadastro: number;
    statusConta: number;
    _all: number;
};
export type UsuarioAvgAggregateInputType = {
    idUsuario?: true;
};
export type UsuarioSumAggregateInputType = {
    idUsuario?: true;
};
export type UsuarioMinAggregateInputType = {
    idUsuario?: true;
    nome?: true;
    email?: true;
    senhaHash?: true;
    telefone?: true;
    cpf?: true;
    fotoPerfil?: true;
    cidade?: true;
    estado?: true;
    dataCadastro?: true;
    statusConta?: true;
};
export type UsuarioMaxAggregateInputType = {
    idUsuario?: true;
    nome?: true;
    email?: true;
    senhaHash?: true;
    telefone?: true;
    cpf?: true;
    fotoPerfil?: true;
    cidade?: true;
    estado?: true;
    dataCadastro?: true;
    statusConta?: true;
};
export type UsuarioCountAggregateInputType = {
    idUsuario?: true;
    nome?: true;
    email?: true;
    senhaHash?: true;
    telefone?: true;
    cpf?: true;
    fotoPerfil?: true;
    cidade?: true;
    estado?: true;
    dataCadastro?: true;
    statusConta?: true;
    _all?: true;
};
export type UsuarioAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UsuarioWhereInput;
    orderBy?: Prisma.UsuarioOrderByWithRelationInput | Prisma.UsuarioOrderByWithRelationInput[];
    cursor?: Prisma.UsuarioWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UsuarioCountAggregateInputType;
    _avg?: UsuarioAvgAggregateInputType;
    _sum?: UsuarioSumAggregateInputType;
    _min?: UsuarioMinAggregateInputType;
    _max?: UsuarioMaxAggregateInputType;
};
export type GetUsuarioAggregateType<T extends UsuarioAggregateArgs> = {
    [P in keyof T & keyof AggregateUsuario]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUsuario[P]> : Prisma.GetScalarType<T[P], AggregateUsuario[P]>;
};
export type UsuarioGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UsuarioWhereInput;
    orderBy?: Prisma.UsuarioOrderByWithAggregationInput | Prisma.UsuarioOrderByWithAggregationInput[];
    by: Prisma.UsuarioScalarFieldEnum[] | Prisma.UsuarioScalarFieldEnum;
    having?: Prisma.UsuarioScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UsuarioCountAggregateInputType | true;
    _avg?: UsuarioAvgAggregateInputType;
    _sum?: UsuarioSumAggregateInputType;
    _min?: UsuarioMinAggregateInputType;
    _max?: UsuarioMaxAggregateInputType;
};
export type UsuarioGroupByOutputType = {
    idUsuario: number;
    nome: string;
    email: string;
    senhaHash: string;
    telefone: string | null;
    cpf: string | null;
    fotoPerfil: string | null;
    cidade: string | null;
    estado: string | null;
    dataCadastro: Date;
    statusConta: $Enums.StatusConta;
    _count: UsuarioCountAggregateOutputType | null;
    _avg: UsuarioAvgAggregateOutputType | null;
    _sum: UsuarioSumAggregateOutputType | null;
    _min: UsuarioMinAggregateOutputType | null;
    _max: UsuarioMaxAggregateOutputType | null;
};
export type GetUsuarioGroupByPayload<T extends UsuarioGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UsuarioGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UsuarioGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UsuarioGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UsuarioGroupByOutputType[P]>;
}>>;
export type UsuarioWhereInput = {
    AND?: Prisma.UsuarioWhereInput | Prisma.UsuarioWhereInput[];
    OR?: Prisma.UsuarioWhereInput[];
    NOT?: Prisma.UsuarioWhereInput | Prisma.UsuarioWhereInput[];
    idUsuario?: Prisma.IntFilter<"Usuario"> | number;
    nome?: Prisma.StringFilter<"Usuario"> | string;
    email?: Prisma.StringFilter<"Usuario"> | string;
    senhaHash?: Prisma.StringFilter<"Usuario"> | string;
    telefone?: Prisma.StringNullableFilter<"Usuario"> | string | null;
    cpf?: Prisma.StringNullableFilter<"Usuario"> | string | null;
    fotoPerfil?: Prisma.StringNullableFilter<"Usuario"> | string | null;
    cidade?: Prisma.StringNullableFilter<"Usuario"> | string | null;
    estado?: Prisma.StringNullableFilter<"Usuario"> | string | null;
    dataCadastro?: Prisma.DateTimeFilter<"Usuario"> | Date | string;
    statusConta?: Prisma.EnumStatusContaFilter<"Usuario"> | $Enums.StatusConta;
    perfis?: Prisma.PerfilUsuarioListRelationFilter;
};
export type UsuarioOrderByWithRelationInput = {
    idUsuario?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    senhaHash?: Prisma.SortOrder;
    telefone?: Prisma.SortOrderInput | Prisma.SortOrder;
    cpf?: Prisma.SortOrderInput | Prisma.SortOrder;
    fotoPerfil?: Prisma.SortOrderInput | Prisma.SortOrder;
    cidade?: Prisma.SortOrderInput | Prisma.SortOrder;
    estado?: Prisma.SortOrderInput | Prisma.SortOrder;
    dataCadastro?: Prisma.SortOrder;
    statusConta?: Prisma.SortOrder;
    perfis?: Prisma.PerfilUsuarioOrderByRelationAggregateInput;
};
export type UsuarioWhereUniqueInput = Prisma.AtLeast<{
    idUsuario?: number;
    email?: string;
    AND?: Prisma.UsuarioWhereInput | Prisma.UsuarioWhereInput[];
    OR?: Prisma.UsuarioWhereInput[];
    NOT?: Prisma.UsuarioWhereInput | Prisma.UsuarioWhereInput[];
    nome?: Prisma.StringFilter<"Usuario"> | string;
    senhaHash?: Prisma.StringFilter<"Usuario"> | string;
    telefone?: Prisma.StringNullableFilter<"Usuario"> | string | null;
    cpf?: Prisma.StringNullableFilter<"Usuario"> | string | null;
    fotoPerfil?: Prisma.StringNullableFilter<"Usuario"> | string | null;
    cidade?: Prisma.StringNullableFilter<"Usuario"> | string | null;
    estado?: Prisma.StringNullableFilter<"Usuario"> | string | null;
    dataCadastro?: Prisma.DateTimeFilter<"Usuario"> | Date | string;
    statusConta?: Prisma.EnumStatusContaFilter<"Usuario"> | $Enums.StatusConta;
    perfis?: Prisma.PerfilUsuarioListRelationFilter;
}, "idUsuario" | "email">;
export type UsuarioOrderByWithAggregationInput = {
    idUsuario?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    senhaHash?: Prisma.SortOrder;
    telefone?: Prisma.SortOrderInput | Prisma.SortOrder;
    cpf?: Prisma.SortOrderInput | Prisma.SortOrder;
    fotoPerfil?: Prisma.SortOrderInput | Prisma.SortOrder;
    cidade?: Prisma.SortOrderInput | Prisma.SortOrder;
    estado?: Prisma.SortOrderInput | Prisma.SortOrder;
    dataCadastro?: Prisma.SortOrder;
    statusConta?: Prisma.SortOrder;
    _count?: Prisma.UsuarioCountOrderByAggregateInput;
    _avg?: Prisma.UsuarioAvgOrderByAggregateInput;
    _max?: Prisma.UsuarioMaxOrderByAggregateInput;
    _min?: Prisma.UsuarioMinOrderByAggregateInput;
    _sum?: Prisma.UsuarioSumOrderByAggregateInput;
};
export type UsuarioScalarWhereWithAggregatesInput = {
    AND?: Prisma.UsuarioScalarWhereWithAggregatesInput | Prisma.UsuarioScalarWhereWithAggregatesInput[];
    OR?: Prisma.UsuarioScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UsuarioScalarWhereWithAggregatesInput | Prisma.UsuarioScalarWhereWithAggregatesInput[];
    idUsuario?: Prisma.IntWithAggregatesFilter<"Usuario"> | number;
    nome?: Prisma.StringWithAggregatesFilter<"Usuario"> | string;
    email?: Prisma.StringWithAggregatesFilter<"Usuario"> | string;
    senhaHash?: Prisma.StringWithAggregatesFilter<"Usuario"> | string;
    telefone?: Prisma.StringNullableWithAggregatesFilter<"Usuario"> | string | null;
    cpf?: Prisma.StringNullableWithAggregatesFilter<"Usuario"> | string | null;
    fotoPerfil?: Prisma.StringNullableWithAggregatesFilter<"Usuario"> | string | null;
    cidade?: Prisma.StringNullableWithAggregatesFilter<"Usuario"> | string | null;
    estado?: Prisma.StringNullableWithAggregatesFilter<"Usuario"> | string | null;
    dataCadastro?: Prisma.DateTimeWithAggregatesFilter<"Usuario"> | Date | string;
    statusConta?: Prisma.EnumStatusContaWithAggregatesFilter<"Usuario"> | $Enums.StatusConta;
};
export type UsuarioCreateInput = {
    nome: string;
    email: string;
    senhaHash: string;
    telefone?: string | null;
    cpf?: string | null;
    fotoPerfil?: string | null;
    cidade?: string | null;
    estado?: string | null;
    dataCadastro?: Date | string;
    statusConta: $Enums.StatusConta;
    perfis?: Prisma.PerfilUsuarioCreateNestedManyWithoutUsuarioInput;
};
export type UsuarioUncheckedCreateInput = {
    idUsuario?: number;
    nome: string;
    email: string;
    senhaHash: string;
    telefone?: string | null;
    cpf?: string | null;
    fotoPerfil?: string | null;
    cidade?: string | null;
    estado?: string | null;
    dataCadastro?: Date | string;
    statusConta: $Enums.StatusConta;
    perfis?: Prisma.PerfilUsuarioUncheckedCreateNestedManyWithoutUsuarioInput;
};
export type UsuarioUpdateInput = {
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    telefone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    fotoPerfil?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    cidade?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    estado?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataCadastro?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    statusConta?: Prisma.EnumStatusContaFieldUpdateOperationsInput | $Enums.StatusConta;
    perfis?: Prisma.PerfilUsuarioUpdateManyWithoutUsuarioNestedInput;
};
export type UsuarioUncheckedUpdateInput = {
    idUsuario?: Prisma.IntFieldUpdateOperationsInput | number;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    telefone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    fotoPerfil?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    cidade?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    estado?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataCadastro?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    statusConta?: Prisma.EnumStatusContaFieldUpdateOperationsInput | $Enums.StatusConta;
    perfis?: Prisma.PerfilUsuarioUncheckedUpdateManyWithoutUsuarioNestedInput;
};
export type UsuarioCreateManyInput = {
    idUsuario?: number;
    nome: string;
    email: string;
    senhaHash: string;
    telefone?: string | null;
    cpf?: string | null;
    fotoPerfil?: string | null;
    cidade?: string | null;
    estado?: string | null;
    dataCadastro?: Date | string;
    statusConta: $Enums.StatusConta;
};
export type UsuarioUpdateManyMutationInput = {
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    telefone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    fotoPerfil?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    cidade?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    estado?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataCadastro?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    statusConta?: Prisma.EnumStatusContaFieldUpdateOperationsInput | $Enums.StatusConta;
};
export type UsuarioUncheckedUpdateManyInput = {
    idUsuario?: Prisma.IntFieldUpdateOperationsInput | number;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    telefone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    fotoPerfil?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    cidade?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    estado?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataCadastro?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    statusConta?: Prisma.EnumStatusContaFieldUpdateOperationsInput | $Enums.StatusConta;
};
export type UsuarioCountOrderByAggregateInput = {
    idUsuario?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    senhaHash?: Prisma.SortOrder;
    telefone?: Prisma.SortOrder;
    cpf?: Prisma.SortOrder;
    fotoPerfil?: Prisma.SortOrder;
    cidade?: Prisma.SortOrder;
    estado?: Prisma.SortOrder;
    dataCadastro?: Prisma.SortOrder;
    statusConta?: Prisma.SortOrder;
};
export type UsuarioAvgOrderByAggregateInput = {
    idUsuario?: Prisma.SortOrder;
};
export type UsuarioMaxOrderByAggregateInput = {
    idUsuario?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    senhaHash?: Prisma.SortOrder;
    telefone?: Prisma.SortOrder;
    cpf?: Prisma.SortOrder;
    fotoPerfil?: Prisma.SortOrder;
    cidade?: Prisma.SortOrder;
    estado?: Prisma.SortOrder;
    dataCadastro?: Prisma.SortOrder;
    statusConta?: Prisma.SortOrder;
};
export type UsuarioMinOrderByAggregateInput = {
    idUsuario?: Prisma.SortOrder;
    nome?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    senhaHash?: Prisma.SortOrder;
    telefone?: Prisma.SortOrder;
    cpf?: Prisma.SortOrder;
    fotoPerfil?: Prisma.SortOrder;
    cidade?: Prisma.SortOrder;
    estado?: Prisma.SortOrder;
    dataCadastro?: Prisma.SortOrder;
    statusConta?: Prisma.SortOrder;
};
export type UsuarioSumOrderByAggregateInput = {
    idUsuario?: Prisma.SortOrder;
};
export type UsuarioScalarRelationFilter = {
    is?: Prisma.UsuarioWhereInput;
    isNot?: Prisma.UsuarioWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type EnumStatusContaFieldUpdateOperationsInput = {
    set?: $Enums.StatusConta;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type UsuarioCreateNestedOneWithoutPerfisInput = {
    create?: Prisma.XOR<Prisma.UsuarioCreateWithoutPerfisInput, Prisma.UsuarioUncheckedCreateWithoutPerfisInput>;
    connectOrCreate?: Prisma.UsuarioCreateOrConnectWithoutPerfisInput;
    connect?: Prisma.UsuarioWhereUniqueInput;
};
export type UsuarioUpdateOneRequiredWithoutPerfisNestedInput = {
    create?: Prisma.XOR<Prisma.UsuarioCreateWithoutPerfisInput, Prisma.UsuarioUncheckedCreateWithoutPerfisInput>;
    connectOrCreate?: Prisma.UsuarioCreateOrConnectWithoutPerfisInput;
    upsert?: Prisma.UsuarioUpsertWithoutPerfisInput;
    connect?: Prisma.UsuarioWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UsuarioUpdateToOneWithWhereWithoutPerfisInput, Prisma.UsuarioUpdateWithoutPerfisInput>, Prisma.UsuarioUncheckedUpdateWithoutPerfisInput>;
};
export type UsuarioCreateWithoutPerfisInput = {
    nome: string;
    email: string;
    senhaHash: string;
    telefone?: string | null;
    cpf?: string | null;
    fotoPerfil?: string | null;
    cidade?: string | null;
    estado?: string | null;
    dataCadastro?: Date | string;
    statusConta: $Enums.StatusConta;
};
export type UsuarioUncheckedCreateWithoutPerfisInput = {
    idUsuario?: number;
    nome: string;
    email: string;
    senhaHash: string;
    telefone?: string | null;
    cpf?: string | null;
    fotoPerfil?: string | null;
    cidade?: string | null;
    estado?: string | null;
    dataCadastro?: Date | string;
    statusConta: $Enums.StatusConta;
};
export type UsuarioCreateOrConnectWithoutPerfisInput = {
    where: Prisma.UsuarioWhereUniqueInput;
    create: Prisma.XOR<Prisma.UsuarioCreateWithoutPerfisInput, Prisma.UsuarioUncheckedCreateWithoutPerfisInput>;
};
export type UsuarioUpsertWithoutPerfisInput = {
    update: Prisma.XOR<Prisma.UsuarioUpdateWithoutPerfisInput, Prisma.UsuarioUncheckedUpdateWithoutPerfisInput>;
    create: Prisma.XOR<Prisma.UsuarioCreateWithoutPerfisInput, Prisma.UsuarioUncheckedCreateWithoutPerfisInput>;
    where?: Prisma.UsuarioWhereInput;
};
export type UsuarioUpdateToOneWithWhereWithoutPerfisInput = {
    where?: Prisma.UsuarioWhereInput;
    data: Prisma.XOR<Prisma.UsuarioUpdateWithoutPerfisInput, Prisma.UsuarioUncheckedUpdateWithoutPerfisInput>;
};
export type UsuarioUpdateWithoutPerfisInput = {
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    telefone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    fotoPerfil?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    cidade?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    estado?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataCadastro?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    statusConta?: Prisma.EnumStatusContaFieldUpdateOperationsInput | $Enums.StatusConta;
};
export type UsuarioUncheckedUpdateWithoutPerfisInput = {
    idUsuario?: Prisma.IntFieldUpdateOperationsInput | number;
    nome?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    senhaHash?: Prisma.StringFieldUpdateOperationsInput | string;
    telefone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    cpf?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    fotoPerfil?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    cidade?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    estado?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dataCadastro?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    statusConta?: Prisma.EnumStatusContaFieldUpdateOperationsInput | $Enums.StatusConta;
};
export type UsuarioCountOutputType = {
    perfis: number;
};
export type UsuarioCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    perfis?: boolean | UsuarioCountOutputTypeCountPerfisArgs;
};
export type UsuarioCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsuarioCountOutputTypeSelect<ExtArgs> | null;
};
export type UsuarioCountOutputTypeCountPerfisArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PerfilUsuarioWhereInput;
};
export type UsuarioSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    idUsuario?: boolean;
    nome?: boolean;
    email?: boolean;
    senhaHash?: boolean;
    telefone?: boolean;
    cpf?: boolean;
    fotoPerfil?: boolean;
    cidade?: boolean;
    estado?: boolean;
    dataCadastro?: boolean;
    statusConta?: boolean;
    perfis?: boolean | Prisma.Usuario$perfisArgs<ExtArgs>;
    _count?: boolean | Prisma.UsuarioCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["usuario"]>;
export type UsuarioSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    idUsuario?: boolean;
    nome?: boolean;
    email?: boolean;
    senhaHash?: boolean;
    telefone?: boolean;
    cpf?: boolean;
    fotoPerfil?: boolean;
    cidade?: boolean;
    estado?: boolean;
    dataCadastro?: boolean;
    statusConta?: boolean;
}, ExtArgs["result"]["usuario"]>;
export type UsuarioSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    idUsuario?: boolean;
    nome?: boolean;
    email?: boolean;
    senhaHash?: boolean;
    telefone?: boolean;
    cpf?: boolean;
    fotoPerfil?: boolean;
    cidade?: boolean;
    estado?: boolean;
    dataCadastro?: boolean;
    statusConta?: boolean;
}, ExtArgs["result"]["usuario"]>;
export type UsuarioSelectScalar = {
    idUsuario?: boolean;
    nome?: boolean;
    email?: boolean;
    senhaHash?: boolean;
    telefone?: boolean;
    cpf?: boolean;
    fotoPerfil?: boolean;
    cidade?: boolean;
    estado?: boolean;
    dataCadastro?: boolean;
    statusConta?: boolean;
};
export type UsuarioOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"idUsuario" | "nome" | "email" | "senhaHash" | "telefone" | "cpf" | "fotoPerfil" | "cidade" | "estado" | "dataCadastro" | "statusConta", ExtArgs["result"]["usuario"]>;
export type UsuarioInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    perfis?: boolean | Prisma.Usuario$perfisArgs<ExtArgs>;
    _count?: boolean | Prisma.UsuarioCountOutputTypeDefaultArgs<ExtArgs>;
};
export type UsuarioIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type UsuarioIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $UsuarioPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Usuario";
    objects: {
        perfis: Prisma.$PerfilUsuarioPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        idUsuario: number;
        nome: string;
        email: string;
        senhaHash: string;
        telefone: string | null;
        cpf: string | null;
        fotoPerfil: string | null;
        cidade: string | null;
        estado: string | null;
        dataCadastro: Date;
        statusConta: $Enums.StatusConta;
    }, ExtArgs["result"]["usuario"]>;
    composites: {};
};
export type UsuarioGetPayload<S extends boolean | null | undefined | UsuarioDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UsuarioPayload, S>;
export type UsuarioCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UsuarioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UsuarioCountAggregateInputType | true;
};
export interface UsuarioDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Usuario'];
        meta: {
            name: 'Usuario';
        };
    };
    findUnique<T extends UsuarioFindUniqueArgs>(args: Prisma.SelectSubset<T, UsuarioFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UsuarioFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UsuarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UsuarioFindFirstArgs>(args?: Prisma.SelectSubset<T, UsuarioFindFirstArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UsuarioFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UsuarioFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UsuarioFindManyArgs>(args?: Prisma.SelectSubset<T, UsuarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UsuarioCreateArgs>(args: Prisma.SelectSubset<T, UsuarioCreateArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UsuarioCreateManyArgs>(args?: Prisma.SelectSubset<T, UsuarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UsuarioCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UsuarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UsuarioDeleteArgs>(args: Prisma.SelectSubset<T, UsuarioDeleteArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UsuarioUpdateArgs>(args: Prisma.SelectSubset<T, UsuarioUpdateArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UsuarioDeleteManyArgs>(args?: Prisma.SelectSubset<T, UsuarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UsuarioUpdateManyArgs>(args: Prisma.SelectSubset<T, UsuarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UsuarioUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UsuarioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UsuarioUpsertArgs>(args: Prisma.SelectSubset<T, UsuarioUpsertArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UsuarioCountArgs>(args?: Prisma.Subset<T, UsuarioCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UsuarioCountAggregateOutputType> : number>;
    aggregate<T extends UsuarioAggregateArgs>(args: Prisma.Subset<T, UsuarioAggregateArgs>): Prisma.PrismaPromise<GetUsuarioAggregateType<T>>;
    groupBy<T extends UsuarioGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UsuarioGroupByArgs['orderBy'];
    } : {
        orderBy?: UsuarioGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UsuarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsuarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UsuarioFieldRefs;
}
export interface Prisma__UsuarioClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    perfis<T extends Prisma.Usuario$perfisArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Usuario$perfisArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PerfilUsuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UsuarioFieldRefs {
    readonly idUsuario: Prisma.FieldRef<"Usuario", 'Int'>;
    readonly nome: Prisma.FieldRef<"Usuario", 'String'>;
    readonly email: Prisma.FieldRef<"Usuario", 'String'>;
    readonly senhaHash: Prisma.FieldRef<"Usuario", 'String'>;
    readonly telefone: Prisma.FieldRef<"Usuario", 'String'>;
    readonly cpf: Prisma.FieldRef<"Usuario", 'String'>;
    readonly fotoPerfil: Prisma.FieldRef<"Usuario", 'String'>;
    readonly cidade: Prisma.FieldRef<"Usuario", 'String'>;
    readonly estado: Prisma.FieldRef<"Usuario", 'String'>;
    readonly dataCadastro: Prisma.FieldRef<"Usuario", 'DateTime'>;
    readonly statusConta: Prisma.FieldRef<"Usuario", 'StatusConta'>;
}
export type UsuarioFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsuarioSelect<ExtArgs> | null;
    omit?: Prisma.UsuarioOmit<ExtArgs> | null;
    include?: Prisma.UsuarioInclude<ExtArgs> | null;
    where: Prisma.UsuarioWhereUniqueInput;
};
export type UsuarioFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsuarioSelect<ExtArgs> | null;
    omit?: Prisma.UsuarioOmit<ExtArgs> | null;
    include?: Prisma.UsuarioInclude<ExtArgs> | null;
    where: Prisma.UsuarioWhereUniqueInput;
};
export type UsuarioFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsuarioSelect<ExtArgs> | null;
    omit?: Prisma.UsuarioOmit<ExtArgs> | null;
    include?: Prisma.UsuarioInclude<ExtArgs> | null;
    where?: Prisma.UsuarioWhereInput;
    orderBy?: Prisma.UsuarioOrderByWithRelationInput | Prisma.UsuarioOrderByWithRelationInput[];
    cursor?: Prisma.UsuarioWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UsuarioScalarFieldEnum | Prisma.UsuarioScalarFieldEnum[];
};
export type UsuarioFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsuarioSelect<ExtArgs> | null;
    omit?: Prisma.UsuarioOmit<ExtArgs> | null;
    include?: Prisma.UsuarioInclude<ExtArgs> | null;
    where?: Prisma.UsuarioWhereInput;
    orderBy?: Prisma.UsuarioOrderByWithRelationInput | Prisma.UsuarioOrderByWithRelationInput[];
    cursor?: Prisma.UsuarioWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UsuarioScalarFieldEnum | Prisma.UsuarioScalarFieldEnum[];
};
export type UsuarioFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsuarioSelect<ExtArgs> | null;
    omit?: Prisma.UsuarioOmit<ExtArgs> | null;
    include?: Prisma.UsuarioInclude<ExtArgs> | null;
    where?: Prisma.UsuarioWhereInput;
    orderBy?: Prisma.UsuarioOrderByWithRelationInput | Prisma.UsuarioOrderByWithRelationInput[];
    cursor?: Prisma.UsuarioWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UsuarioScalarFieldEnum | Prisma.UsuarioScalarFieldEnum[];
};
export type UsuarioCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsuarioSelect<ExtArgs> | null;
    omit?: Prisma.UsuarioOmit<ExtArgs> | null;
    include?: Prisma.UsuarioInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UsuarioCreateInput, Prisma.UsuarioUncheckedCreateInput>;
};
export type UsuarioCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UsuarioCreateManyInput | Prisma.UsuarioCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UsuarioCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsuarioSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UsuarioOmit<ExtArgs> | null;
    data: Prisma.UsuarioCreateManyInput | Prisma.UsuarioCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UsuarioUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsuarioSelect<ExtArgs> | null;
    omit?: Prisma.UsuarioOmit<ExtArgs> | null;
    include?: Prisma.UsuarioInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UsuarioUpdateInput, Prisma.UsuarioUncheckedUpdateInput>;
    where: Prisma.UsuarioWhereUniqueInput;
};
export type UsuarioUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UsuarioUpdateManyMutationInput, Prisma.UsuarioUncheckedUpdateManyInput>;
    where?: Prisma.UsuarioWhereInput;
    limit?: number;
};
export type UsuarioUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsuarioSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UsuarioOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UsuarioUpdateManyMutationInput, Prisma.UsuarioUncheckedUpdateManyInput>;
    where?: Prisma.UsuarioWhereInput;
    limit?: number;
};
export type UsuarioUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsuarioSelect<ExtArgs> | null;
    omit?: Prisma.UsuarioOmit<ExtArgs> | null;
    include?: Prisma.UsuarioInclude<ExtArgs> | null;
    where: Prisma.UsuarioWhereUniqueInput;
    create: Prisma.XOR<Prisma.UsuarioCreateInput, Prisma.UsuarioUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UsuarioUpdateInput, Prisma.UsuarioUncheckedUpdateInput>;
};
export type UsuarioDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsuarioSelect<ExtArgs> | null;
    omit?: Prisma.UsuarioOmit<ExtArgs> | null;
    include?: Prisma.UsuarioInclude<ExtArgs> | null;
    where: Prisma.UsuarioWhereUniqueInput;
};
export type UsuarioDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UsuarioWhereInput;
    limit?: number;
};
export type Usuario$perfisArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PerfilUsuarioSelect<ExtArgs> | null;
    omit?: Prisma.PerfilUsuarioOmit<ExtArgs> | null;
    include?: Prisma.PerfilUsuarioInclude<ExtArgs> | null;
    where?: Prisma.PerfilUsuarioWhereInput;
    orderBy?: Prisma.PerfilUsuarioOrderByWithRelationInput | Prisma.PerfilUsuarioOrderByWithRelationInput[];
    cursor?: Prisma.PerfilUsuarioWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PerfilUsuarioScalarFieldEnum | Prisma.PerfilUsuarioScalarFieldEnum[];
};
export type UsuarioDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsuarioSelect<ExtArgs> | null;
    omit?: Prisma.UsuarioOmit<ExtArgs> | null;
    include?: Prisma.UsuarioInclude<ExtArgs> | null;
};
