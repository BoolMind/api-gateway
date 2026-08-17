import { OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable } from "rxjs";

import { callGrpc } from "../../common";

export interface CrudGrpcServiceClient {
  create(request: any): Observable<any>;
  getById(request: any): Observable<any>;
  update(request: any): Observable<any>;
  delete(request: any): Observable<any>;
  restore(request: any): Observable<any>;
  paginate(request: any): Observable<any>;
}

type ReqOf<Fn> = Fn extends (request: infer R) => Observable<any> ? R : never;
type ResOf<Fn> = Fn extends (request: any) => Observable<infer R> ? R : never;

export abstract class BaseGrpcCrudClient<
  TClient extends CrudGrpcServiceClient,
> implements OnModuleInit {
  protected service!: TClient;

  protected constructor(
    private readonly grpcClient: ClientGrpc,

    private readonly serviceName: string,

    protected readonly sourceLabel: string,
    private readonly timeoutMs: number,
  ) {}

  onModuleInit(): void {
    this.service = this.grpcClient.getService<TClient>(this.serviceName);
  }

  public create(
    request: ReqOf<TClient["create"]>,
  ): Promise<ResOf<TClient["create"]>> {
    return callGrpc(this.service.create(request), {
      source: this.sourceLabel,
      timeoutMs: this.timeoutMs,
    });
  }

  public getById(
    request: ReqOf<TClient["getById"]>,
  ): Promise<ResOf<TClient["getById"]>> {
    return callGrpc(this.service.getById(request), {
      source: this.sourceLabel,
      timeoutMs: this.timeoutMs,
    });
  }

  public update(
    request: ReqOf<TClient["update"]>,
  ): Promise<ResOf<TClient["update"]>> {
    return callGrpc(this.service.update(request), {
      source: this.sourceLabel,
      timeoutMs: this.timeoutMs,
    });
  }

  public delete(
    request: ReqOf<TClient["delete"]>,
  ): Promise<ResOf<TClient["delete"]>> {
    return callGrpc(this.service.delete(request), {
      source: this.sourceLabel,
      timeoutMs: this.timeoutMs,
    });
  }

  public restore(
    request: ReqOf<TClient["restore"]>,
  ): Promise<ResOf<TClient["restore"]>> {
    return callGrpc(this.service.restore(request), {
      source: this.sourceLabel,
      timeoutMs: this.timeoutMs,
    });
  }

  public paginate(
    request: ReqOf<TClient["paginate"]>,
  ): Promise<ResOf<TClient["paginate"]>> {
    return callGrpc(this.service.paginate(request), {
      source: this.sourceLabel,
      timeoutMs: this.timeoutMs,
    });
  }

  protected call<Res>(source$: Observable<Res>): Promise<Res> {
    return callGrpc(source$, {
      source: this.sourceLabel,
      timeoutMs: this.timeoutMs,
    });
  }
}
