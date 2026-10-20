import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TipoUsuarioModel = runtime.Types.Result.DefaultSelection<Prisma.$TipoUsuarioPayload>;
export type AggregateTipoUsuario = {
    _count: TipoUsuarioCountAggregateOutputType | null;
    _avg: TipoUsuarioAvgAggregateOutputType | null;
    _sum: TipoUsuarioSumAggregateOutputType | null;
    _min: TipoUsuarioMinAggregateOutputType | null;
    _max: TipoUsuarioMaxAggregateOutputType | null;
};
export type TipoUsuarioAvgAggregateOutputType = {
    idTipoUsuario: number | null;
};
export type TipoUsuarioSumAggregateOutputType = {
    idTipoUsuario: number | null;
};
export type TipoUsuarioMinAggregateOutputType = {
    idTipoUsuario: number | null;
    nomeTipo: $Enums.PapelUsuario | null;
    descricao: string | null;
};
export type TipoUsuarioMaxAggregateOutputType = {
    idTipoUsuario: number | null;
    nomeTipo: $Enums.PapelUsuario | null;
    descricao: string | null;
};
export type TipoUsuarioCountAggregateOutputType = {
    idTipoUsuario: number;
    nomeTipo: number;
    descricao: number;
    _all: number;
};
export type TipoUsuarioAvgAggregateInputType = {
    idTipoUsuario?: true;
};
export type TipoUsuarioSumAggregateInputType = {
    idTipoUsuario?: true;
};
export type TipoUsuarioMinAggregateInputType = {
    idTipoUsuario?: true;
    nomeTipo?: true;
    descricao?: true;
};
export type TipoUsuarioMaxAggregateInputType = {
    idTipoUsuario?: true;
    nomeTipo?: true;
    descricao?: true;
};
export type TipoUsuarioCountAggregateInputType = {
    idTipoUsuario?: true;
    nomeTipo?: true;
    descricao?: true;
    _all?: true;
};
export type TipoUsuarioAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TipoUsuarioWhereInput;
    orderBy?: Prisma.TipoUsuarioOrderByWithRelationInput | Prisma.TipoUsuarioOrderByWithRelationInput[];
    cursor?: Prisma.TipoUsuarioWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TipoUsuarioCountAggregateInputType;
    _avg?: TipoUsuarioAvgAggregateInputType;
    _sum?: TipoUsuarioSumAggregateInputType;
    _min?: TipoUsuarioMinAggregateInputType;
    _max?: TipoUsuarioMaxAggregateInputType;
};
export type GetTipoUsuarioAggregateType<T extends TipoUsuarioAggregateArgs> = {
    [P in keyof T & keyof AggregateTipoUsuario]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTipoUsuario[P]> : Prisma.GetScalarType<T[P], AggregateTipoUsuario[P]>;
};
export type TipoUsuarioGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TipoUsuarioWhereInput;
    orderBy?: Prisma.TipoUsuarioOrderByWithAggregationInput | Prisma.TipoUsuarioOrderByWithAggregationInput[];
    by: Prisma.TipoUsuarioScalarFieldEnum[] | Prisma.TipoUsuarioScalarFieldEnum;
    having?: Prisma.TipoUsuarioScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TipoUsuarioCountAggregateInputType | true;
    _avg?: TipoUsuarioAvgAggregateInputType;
    _sum?: TipoUsuarioSumAggregateInputType;
    _min?: TipoUsuarioMinAggregateInputType;
    _max?: TipoUsuarioMaxAggregateInputType;
};
export type TipoUsuarioGroupByOutputType = {
    idTipoUsuario: number;
    nomeTipo: $Enums.PapelUsuario;
    descricao: string | null;
    _count: TipoUsuarioCountAggregateOutputType | null;
    _avg: TipoUsuarioAvgAggregateOutputType | null;
    _sum: TipoUsuarioSumAggregateOutputType | null;
    _min: TipoUsuarioMinAggregateOutputType | null;
    _max: TipoUsuarioMaxAggregateOutputType | null;
};
export type GetTipoUsuarioGroupByPayload<T extends TipoUsuarioGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TipoUsuarioGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TipoUsuarioGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TipoUsuarioGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TipoUsuarioGroupByOutputType[P]>;
}>>;
export type TipoUsuarioWhereInput = {
    AND?: Prisma.TipoUsuarioWhereInput | Prisma.TipoUsuarioWhereInput[];
    OR?: Prisma.TipoUsuarioWhereInput[];
    NOT?: Prisma.TipoUsuarioWhereInput | Prisma.TipoUsuarioWhereInput[];
    idTipoUsuario?: Prisma.IntFilter<"TipoUsuario"> | number;
    nomeTipo?: Prisma.EnumPapelUsuarioFilter<"TipoUsuario"> | $Enums.PapelUsuario;
    descricao?: Prisma.StringNullableFilter<"TipoUsuario"> | string | null;
    perfis?: Prisma.PerfilUsuarioListRelationFilter;
};
export type TipoUsuarioOrderByWithRelationInput = {
    idTipoUsuario?: Prisma.SortOrder;
    nomeTipo?: Prisma.SortOrder;
    descricao?: Prisma.SortOrderInput | Prisma.SortOrder;
    perfis?: Prisma.PerfilUsuarioOrderByRelationAggregateInput;
};
export type TipoUsuarioWhereUniqueInput = Prisma.AtLeast<{
    idTipoUsuario?: number;
    nomeTipo?: $Enums.PapelUsuario;
    AND?: Prisma.TipoUsuarioWhereInput | Prisma.TipoUsuarioWhereInput[];
    OR?: Prisma.TipoUsuarioWhereInput[];
    NOT?: Prisma.TipoUsuarioWhereInput | Prisma.TipoUsuarioWhereInput[];
    descricao?: Prisma.StringNullableFilter<"TipoUsuario"> | string | null;
    perfis?: Prisma.PerfilUsuarioListRelationFilter;
}, "idTipoUsuario" | "nomeTipo">;
export type TipoUsuarioOrderByWithAggregationInput = {
    idTipoUsuario?: Prisma.SortOrder;
    nomeTipo?: Prisma.SortOrder;
    descricao?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.TipoUsuarioCountOrderByAggregateInput;
    _avg?: Prisma.TipoUsuarioAvgOrderByAggregateInput;
    _max?: Prisma.TipoUsuarioMaxOrderByAggregateInput;
    _min?: Prisma.TipoUsuarioMinOrderByAggregateInput;
    _sum?: Prisma.TipoUsuarioSumOrderByAggregateInput;
};
export type TipoUsuarioScalarWhereWithAggregatesInput = {
    AND?: Prisma.TipoUsuarioScalarWhereWithAggregatesInput | Prisma.TipoUsuarioScalarWhereWithAggregatesInput[];
    OR?: Prisma.TipoUsuarioScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TipoUsuarioScalarWhereWithAggregatesInput | Prisma.TipoUsuarioScalarWhereWithAggregatesInput[];
    idTipoUsuario?: Prisma.IntWithAggregatesFilter<"TipoUsuario"> | number;
    nomeTipo?: Prisma.EnumPapelUsuarioWithAggregatesFilter<"TipoUsuario"> | $Enums.PapelUsuario;
    descricao?: Prisma.StringNullableWithAggregatesFilter<"TipoUsuario"> | string | null;
};
export type TipoUsuarioCreateInput = {
    nomeTipo: $Enums.PapelUsuario;
    descricao?: string | null;
    perfis?: Prisma.PerfilUsuarioCreateNestedManyWithoutTipoUsuarioInput;
};
export type TipoUsuarioUncheckedCreateInput = {
    idTipoUsuario?: number;
    nomeTipo: $Enums.PapelUsuario;
    descricao?: string | null;
    perfis?: Prisma.PerfilUsuarioUncheckedCreateNestedManyWithoutTipoUsuarioInput;
};
export type TipoUsuarioUpdateInput = {
    nomeTipo?: Prisma.EnumPapelUsuarioFieldUpdateOperationsInput | $Enums.PapelUsuario;
    descricao?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    perfis?: Prisma.PerfilUsuarioUpdateManyWithoutTipoUsuarioNestedInput;
};
export type TipoUsuarioUncheckedUpdateInput = {
    idTipoUsuario?: Prisma.IntFieldUpdateOperationsInput | number;
    nomeTipo?: Prisma.EnumPapelUsuarioFieldUpdateOperationsInput | $Enums.PapelUsuario;
    descricao?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    perfis?: Prisma.PerfilUsuarioUncheckedUpdateManyWithoutTipoUsuarioNestedInput;
};
export type TipoUsuarioCreateManyInput = {
    idTipoUsuario?: number;
    nomeTipo: $Enums.PapelUsuario;
    descricao?: string | null;
};
export type TipoUsuarioUpdateManyMutationInput = {
    nomeTipo?: Prisma.EnumPapelUsuarioFieldUpdateOperationsInput | $Enums.PapelUsuario;
    descricao?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TipoUsuarioUncheckedUpdateManyInput = {
    idTipoUsuario?: Prisma.IntFieldUpdateOperationsInput | number;
    nomeTipo?: Prisma.EnumPapelUsuarioFieldUpdateOperationsInput | $Enums.PapelUsuario;
    descricao?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TipoUsuarioCountOrderByAggregateInput = {
    idTipoUsuario?: Prisma.SortOrder;
    nomeTipo?: Prisma.SortOrder;
    descricao?: Prisma.SortOrder;
};
export type TipoUsuarioAvgOrderByAggregateInput = {
    idTipoUsuario?: Prisma.SortOrder;
};
export type TipoUsuarioMaxOrderByAggregateInput = {
    idTipoUsuario?: Prisma.SortOrder;
    nomeTipo?: Prisma.SortOrder;
    descricao?: Prisma.SortOrder;
};
export type TipoUsuarioMinOrderByAggregateInput = {
    idTipoUsuario?: Prisma.SortOrder;
    nomeTipo?: Prisma.SortOrder;
    descricao?: Prisma.SortOrder;
};
export type TipoUsuarioSumOrderByAggregateInput = {
    idTipoUsuario?: Prisma.SortOrder;
};
export type TipoUsuarioScalarRelationFilter = {
    is?: Prisma.TipoUsuarioWhereInput;
    isNot?: Prisma.TipoUsuarioWhereInput;
};
export type EnumPapelUsuarioFieldUpdateOperationsInput = {
    set?: $Enums.PapelUsuario;
};
export type TipoUsuarioCreateNestedOneWithoutPerfisInput = {
    create?: Prisma.XOR<Prisma.TipoUsuarioCreateWithoutPerfisInput, Prisma.TipoUsuarioUncheckedCreateWithoutPerfisInput>;
    connectOrCreate?: Prisma.TipoUsuarioCreateOrConnectWithoutPerfisInput;
    connect?: Prisma.TipoUsuarioWhereUniqueInput;
};
export type TipoUsuarioUpdateOneRequiredWithoutPerfisNestedInput = {
    create?: Prisma.XOR<Prisma.TipoUsuarioCreateWithoutPerfisInput, Prisma.TipoUsuarioUncheckedCreateWithoutPerfisInput>;
    connectOrCreate?: Prisma.TipoUsuarioCreateOrConnectWithoutPerfisInput;
    upsert?: Prisma.TipoUsuarioUpsertWithoutPerfisInput;
    connect?: Prisma.TipoUsuarioWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TipoUsuarioUpdateToOneWithWhereWithoutPerfisInput, Prisma.TipoUsuarioUpdateWithoutPerfisInput>, Prisma.TipoUsuarioUncheckedUpdateWithoutPerfisInput>;
};
export type TipoUsuarioCreateWithoutPerfisInput = {
    nomeTipo: $Enums.PapelUsuario;
    descricao?: string | null;
};
export type TipoUsuarioUncheckedCreateWithoutPerfisInput = {
    idTipoUsuario?: number;
    nomeTipo: $Enums.PapelUsuario;
    descricao?: string | null;
};
export type TipoUsuarioCreateOrConnectWithoutPerfisInput = {
    where: Prisma.TipoUsuarioWhereUniqueInput;
    create: Prisma.XOR<Prisma.TipoUsuarioCreateWithoutPerfisInput, Prisma.TipoUsuarioUncheckedCreateWithoutPerfisInput>;
};
export type TipoUsuarioUpsertWithoutPerfisInput = {
    update: Prisma.XOR<Prisma.TipoUsuarioUpdateWithoutPerfisInput, Prisma.TipoUsuarioUncheckedUpdateWithoutPerfisInput>;
    create: Prisma.XOR<Prisma.TipoUsuarioCreateWithoutPerfisInput, Prisma.TipoUsuarioUncheckedCreateWithoutPerfisInput>;
    where?: Prisma.TipoUsuarioWhereInput;
};
export type TipoUsuarioUpdateToOneWithWhereWithoutPerfisInput = {
    where?: Prisma.TipoUsuarioWhereInput;
    data: Prisma.XOR<Prisma.TipoUsuarioUpdateWithoutPerfisInput, Prisma.TipoUsuarioUncheckedUpdateWithoutPerfisInput>;
};
export type TipoUsuarioUpdateWithoutPerfisInput = {
    nomeTipo?: Prisma.EnumPapelUsuarioFieldUpdateOperationsInput | $Enums.PapelUsuario;
    descricao?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TipoUsuarioUncheckedUpdateWithoutPerfisInput = {
    idTipoUsuario?: Prisma.IntFieldUpdateOperationsInput | number;
    nomeTipo?: Prisma.EnumPapelUsuarioFieldUpdateOperationsInput | $Enums.PapelUsuario;
    descricao?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TipoUsuarioCountOutputType = {
    perfis: number;
};
export type TipoUsuarioCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    perfis?: boolean | TipoUsuarioCountOutputTypeCountPerfisArgs;
};
export type TipoUsuarioCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TipoUsuarioCountOutputTypeSelect<ExtArgs> | null;
};
export type TipoUsuarioCountOutputTypeCountPerfisArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PerfilUsuarioWhereInput;
};
export type TipoUsuarioSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    idTipoUsuario?: boolean;
    nomeTipo?: boolean;
    descricao?: boolean;
    perfis?: boolean | Prisma.TipoUsuario$perfisArgs<ExtArgs>;
    _count?: boolean | Prisma.TipoUsuarioCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tipoUsuario"]>;
export type TipoUsuarioSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    idTipoUsuario?: boolean;
    nomeTipo?: boolean;
    descricao?: boolean;
}, ExtArgs["result"]["tipoUsuario"]>;
export type TipoUsuarioSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    idTipoUsuario?: boolean;
    nomeTipo?: boolean;
    descricao?: boolean;
}, ExtArgs["result"]["tipoUsuario"]>;
export type TipoUsuarioSelectScalar = {
    idTipoUsuario?: boolean;
    nomeTipo?: boolean;
    descricao?: boolean;
};
export type TipoUsuarioOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"idTipoUsuario" | "nomeTipo" | "descricao", ExtArgs["result"]["tipoUsuario"]>;
export type TipoUsuarioInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    perfis?: boolean | Prisma.TipoUsuario$perfisArgs<ExtArgs>;
    _count?: boolean | Prisma.TipoUsuarioCountOutputTypeDefaultArgs<ExtArgs>;
};
export type TipoUsuarioIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type TipoUsuarioIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $TipoUsuarioPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TipoUsuario";
    objects: {
        perfis: Prisma.$PerfilUsuarioPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        idTipoUsuario: number;
        nomeTipo: $Enums.PapelUsuario;
        descricao: string | null;
    }, ExtArgs["result"]["tipoUsuario"]>;
    composites: {};
};
export type TipoUsuarioGetPayload<S extends boolean | null | undefined | TipoUsuarioDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TipoUsuarioPayload, S>;
export type TipoUsuarioCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TipoUsuarioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TipoUsuarioCountAggregateInputType | true;
};
export interface TipoUsuarioDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TipoUsuario'];
        meta: {
            name: 'TipoUsuario';
        };
    };
    findUnique<T extends TipoUsuarioFindUniqueArgs>(args: Prisma.SelectSubset<T, TipoUsuarioFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TipoUsuarioClient<runtime.Types.Result.GetResult<Prisma.$TipoUsuarioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TipoUsuarioFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TipoUsuarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TipoUsuarioClient<runtime.Types.Result.GetResult<Prisma.$TipoUsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TipoUsuarioFindFirstArgs>(args?: Prisma.SelectSubset<T, TipoUsuarioFindFirstArgs<ExtArgs>>): Prisma.Prisma__TipoUsuarioClient<runtime.Types.Result.GetResult<Prisma.$TipoUsuarioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TipoUsuarioFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TipoUsuarioFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TipoUsuarioClient<runtime.Types.Result.GetResult<Prisma.$TipoUsuarioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TipoUsuarioFindManyArgs>(args?: Prisma.SelectSubset<T, TipoUsuarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TipoUsuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TipoUsuarioCreateArgs>(args: Prisma.SelectSubset<T, TipoUsuarioCreateArgs<ExtArgs>>): Prisma.Prisma__TipoUsuarioClient<runtime.Types.Result.GetResult<Prisma.$TipoUsuarioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TipoUsuarioCreateManyArgs>(args?: Prisma.SelectSubset<T, TipoUsuarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TipoUsuarioCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TipoUsuarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TipoUsuarioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TipoUsuarioDeleteArgs>(args: Prisma.SelectSubset<T, TipoUsuarioDeleteArgs<ExtArgs>>): Prisma.Prisma__TipoUsuarioClient<runtime.Types.Result.GetResult<Prisma.$TipoUsuarioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TipoUsuarioUpdateArgs>(args: Prisma.SelectSubset<T, TipoUsuarioUpdateArgs<ExtArgs>>): Prisma.Prisma__TipoUsuarioClient<runtime.Types.Result.GetResult<Prisma.$TipoUsuarioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TipoUsuarioDeleteManyArgs>(args?: Prisma.SelectSubset<T, TipoUsuarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TipoUsuarioUpdateManyArgs>(args: Prisma.SelectSubset<T, TipoUsuarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TipoUsuarioUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TipoUsuarioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TipoUsuarioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TipoUsuarioUpsertArgs>(args: Prisma.SelectSubset<T, TipoUsuarioUpsertArgs<ExtArgs>>): Prisma.Prisma__TipoUsuarioClient<runtime.Types.Result.GetResult<Prisma.$TipoUsuarioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TipoUsuarioCountArgs>(args?: Prisma.Subset<T, TipoUsuarioCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TipoUsuarioCountAggregateOutputType> : number>;
    aggregate<T extends TipoUsuarioAggregateArgs>(args: Prisma.Subset<T, TipoUsuarioAggregateArgs>): Prisma.PrismaPromise<GetTipoUsuarioAggregateType<T>>;
    groupBy<T extends TipoUsuarioGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TipoUsuarioGroupByArgs['orderBy'];
    } : {
        orderBy?: TipoUsuarioGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TipoUsuarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTipoUsuarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TipoUsuarioFieldRefs;
}
export interface Prisma__TipoUsuarioClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    perfis<T extends Prisma.TipoUsuario$perfisArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TipoUsuario$perfisArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PerfilUsuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TipoUsuarioFieldRefs {
    readonly idTipoUsuario: Prisma.FieldRef<"TipoUsuario", 'Int'>;
    readonly nomeTipo: Prisma.FieldRef<"TipoUsuario", 'PapelUsuario'>;
    readonly descricao: Prisma.FieldRef<"TipoUsuario", 'String'>;
}
export type TipoUsuarioFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TipoUsuarioSelect<ExtArgs> | null;
    omit?: Prisma.TipoUsuarioOmit<ExtArgs> | null;
    include?: Prisma.TipoUsuarioInclude<ExtArgs> | null;
    where: Prisma.TipoUsuarioWhereUniqueInput;
};
export type TipoUsuarioFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TipoUsuarioSelect<ExtArgs> | null;
    omit?: Prisma.TipoUsuarioOmit<ExtArgs> | null;
    include?: Prisma.TipoUsuarioInclude<ExtArgs> | null;
    where: Prisma.TipoUsuarioWhereUniqueInput;
};
export type TipoUsuarioFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TipoUsuarioSelect<ExtArgs> | null;
    omit?: Prisma.TipoUsuarioOmit<ExtArgs> | null;
    include?: Prisma.TipoUsuarioInclude<ExtArgs> | null;
    where?: Prisma.TipoUsuarioWhereInput;
    orderBy?: Prisma.TipoUsuarioOrderByWithRelationInput | Prisma.TipoUsuarioOrderByWithRelationInput[];
    cursor?: Prisma.TipoUsuarioWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TipoUsuarioScalarFieldEnum | Prisma.TipoUsuarioScalarFieldEnum[];
};
export type TipoUsuarioFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TipoUsuarioSelect<ExtArgs> | null;
    omit?: Prisma.TipoUsuarioOmit<ExtArgs> | null;
    include?: Prisma.TipoUsuarioInclude<ExtArgs> | null;
    where?: Prisma.TipoUsuarioWhereInput;
    orderBy?: Prisma.TipoUsuarioOrderByWithRelationInput | Prisma.TipoUsuarioOrderByWithRelationInput[];
    cursor?: Prisma.TipoUsuarioWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TipoUsuarioScalarFieldEnum | Prisma.TipoUsuarioScalarFieldEnum[];
};
export type TipoUsuarioFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TipoUsuarioSelect<ExtArgs> | null;
    omit?: Prisma.TipoUsuarioOmit<ExtArgs> | null;
    include?: Prisma.TipoUsuarioInclude<ExtArgs> | null;
    where?: Prisma.TipoUsuarioWhereInput;
    orderBy?: Prisma.TipoUsuarioOrderByWithRelationInput | Prisma.TipoUsuarioOrderByWithRelationInput[];
    cursor?: Prisma.TipoUsuarioWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TipoUsuarioScalarFieldEnum | Prisma.TipoUsuarioScalarFieldEnum[];
};
export type TipoUsuarioCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TipoUsuarioSelect<ExtArgs> | null;
    omit?: Prisma.TipoUsuarioOmit<ExtArgs> | null;
    include?: Prisma.TipoUsuarioInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TipoUsuarioCreateInput, Prisma.TipoUsuarioUncheckedCreateInput>;
};
export type TipoUsuarioCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TipoUsuarioCreateManyInput | Prisma.TipoUsuarioCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TipoUsuarioCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TipoUsuarioSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TipoUsuarioOmit<ExtArgs> | null;
    data: Prisma.TipoUsuarioCreateManyInput | Prisma.TipoUsuarioCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TipoUsuarioUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TipoUsuarioSelect<ExtArgs> | null;
    omit?: Prisma.TipoUsuarioOmit<ExtArgs> | null;
    include?: Prisma.TipoUsuarioInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TipoUsuarioUpdateInput, Prisma.TipoUsuarioUncheckedUpdateInput>;
    where: Prisma.TipoUsuarioWhereUniqueInput;
};
export type TipoUsuarioUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TipoUsuarioUpdateManyMutationInput, Prisma.TipoUsuarioUncheckedUpdateManyInput>;
    where?: Prisma.TipoUsuarioWhereInput;
    limit?: number;
};
export type TipoUsuarioUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TipoUsuarioSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TipoUsuarioOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TipoUsuarioUpdateManyMutationInput, Prisma.TipoUsuarioUncheckedUpdateManyInput>;
    where?: Prisma.TipoUsuarioWhereInput;
    limit?: number;
};
export type TipoUsuarioUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TipoUsuarioSelect<ExtArgs> | null;
    omit?: Prisma.TipoUsuarioOmit<ExtArgs> | null;
    include?: Prisma.TipoUsuarioInclude<ExtArgs> | null;
    where: Prisma.TipoUsuarioWhereUniqueInput;
    create: Prisma.XOR<Prisma.TipoUsuarioCreateInput, Prisma.TipoUsuarioUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TipoUsuarioUpdateInput, Prisma.TipoUsuarioUncheckedUpdateInput>;
};
export type TipoUsuarioDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TipoUsuarioSelect<ExtArgs> | null;
    omit?: Prisma.TipoUsuarioOmit<ExtArgs> | null;
    include?: Prisma.TipoUsuarioInclude<ExtArgs> | null;
    where: Prisma.TipoUsuarioWhereUniqueInput;
};
export type TipoUsuarioDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TipoUsuarioWhereInput;
    limit?: number;
};
export type TipoUsuario$perfisArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TipoUsuarioDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TipoUsuarioSelect<ExtArgs> | null;
    omit?: Prisma.TipoUsuarioOmit<ExtArgs> | null;
    include?: Prisma.TipoUsuarioInclude<ExtArgs> | null;
};
