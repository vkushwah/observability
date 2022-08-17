export interface NginxSource {
  msec: number;
  connection: number;
  connection_requests: number;
  pid: number;
  request_id: string;
  request_length: number;
  remote_addr: string;
  remote_user: string;
  remote_port: number;
  time_local: string;
  time_iso8601: string;
  request: string;
  request_uri: string;
  args: string;
  status: number;
  body_bytes_sent: number;
  bytes_sent: number;
  http_referer: string;
  http_user_agent: string;
  http_x_forwarded_for: string;
  http_host: string;
  server_name: string;
  request_time: number;
  upstream: string;
  upstream_connect_time: number;
  upstream_header_time: number;
  upstream_response_time: string;
  upstream_response_length: number;
  upstream_cache_status: string;
  ssl_protocol: string;
  ssl_cipher: string;
  scheme: string;
  request_method: string;
  server_protocol: string;
  pipe: string;
  gzip_ratio: number;
  '@timestamp': string;
}

export interface Total {
  value: number;
  relation: string;
}

export interface Hits {
  _index: string;
  _id: string;
  _score: number;
  _source: NginxSource;
}

export interface HitsObject {
  total: Total;
  max_score: number;
  hits: Hits[];
}

export interface Shards {
  total: number;
  successful: number;
  skipped: number;
  failed: number;
}

export interface NginxSchema {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: HitsObject;
}
