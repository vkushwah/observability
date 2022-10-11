export enum NginxConfig {
  STEP_1 = 'Step 1',
  STEP_2 = 'Step 2',
  STEP_3 = 'Step 3',
  STEP_4 = 'Step 4',
  STEP1_DESC = 'In this step we have added the custom log that we want to retrieve in the log.',
  STEP2_DESC = 'In this step we need to provide the location of the access file.',
  STEP3_DESC = 'In this step we need to update the fluent configuration file (fluent.conf)',
  STEP4_DESC = 'In this step we need to provide the location of the access file.',
  STEP5_DESC = 'In this setting we have created nginx_json_format as index to fetch data.',
  CONFIGURATION_STEP1 = `'{'
  '"msec": "$msec", ' # request unixtime in seconds with a milliseconds resolution
  '"connection": "$connection", ' # connection serial number
  '"connection_requests": "$connection_requests", ' # number of requests made in connection
  '"pid": "$pid", ' # process pid
  '"request_id": "$request_id", ' # the unique request id
  '"request_length": "$request_length", ' # request length (including headers and body)
  '"remote_addr": "$remote_addr", ' # client IP
  '"remote_user": "$remote_user", ' # client HTTP username
  '"remote_port": "$remote_port", ' # client port
  '"time_local": "$time_local", '
  '"time_iso8601": "$time_iso8601", ' # local time in the ISO 8601 standard format
  '"request": "$request", ' # full path no arguments if the request
  '"request_uri": "$request_uri", ' # full path and arguments if the request
  '"args": "$args", ' # args
  '"status": "$status", ' # response status code
  '"body_bytes_sent": "$body_bytes_sent", ' # the number of body bytes exclude headers sent to a client
  '"bytes_sent": "$bytes_sent", ' # the number of bytes sent to a client
  '"http_referer": "$http_referer", ' # HTTP referer
  '"http_user_agent": "$http_user_agent", ' # user agent
  '"http_x_forwarded_for": "$http_x_forwarded_for", ' # http_x_forwarded_for
  '"http_host": "$http_host", ' # the request Host: header
  '"server_name": "$server_name", ' # the name of the vhost serving the request
  '"request_time": "$request_time", ' # request processing time in seconds with msec resolution
  '"upstream": "$upstream_addr", ' # upstream backend server for proxied requests
  '"upstream_connect_time": "$upstream_connect_time", ' # upstream handshake time incl. TLS
  '"upstream_header_time": "$upstream_header_time", ' # time spent receiving upstream headers
  '"upstream_response_time": "$upstream_response_time", ' # time spent receiving upstream body
  '"upstream_response_length": "$upstream_response_length", ' # upstream response length
  '"upstream_cache_status": "$upstream_cache_status", ' # cache HIT/MISS where applicable
  '"ssl_protocol": "$ssl_protocol", ' # TLS protocol
  '"ssl_cipher": "$ssl_cipher", ' # TLS cipher
  '"scheme": "$scheme", ' # http or https
  '"request_method": "$request_method", ' # request method
  '"server_protocol": "$server_protocol", ' # request protocol, like HTTP/1.1 or HTTP/2.0
  '"pipe": "$pipe", ' # "p" if request was pipelined, "." otherwise
  '"gzip_ratio": "$gzip_ratio"'
  '}'`,
  CONFIGURATION_STEP2 = `##this uses the our custom log format access_log /var/log/nginx/json_format.log custom_format`,
  CONFIGURATION_STEP3 = `<source>
    @type tail
    <parse>
        @type json
        time_key time
        time_format %time_iso8601
    typescode:integer,size:integer,connections_active:integer,request_time:float,upstream_connect_time:float,bytes_sent_body:integer,upstream_header_time:float,upstream_connect_time_1:float,upstream_header_time1:float,upstream_response_length:integer,upstream_response_time1:float,upstream_status:integer,bytes_sent:integer,connection:integer,content_length:integer,msec:float,pid:integer,realip_remote_port:integer,remote_port:integer,request_length:integer,tcpinfo_rtt:integer,tcpinfo_rttvar:integer,tcpinfo_rcv_space:integer,tcpinfo_snd_cwnd:integer,connection_requests:integer,connections_reading:integer,connections_waiting:integer,connections_writing:integer,gzip_ratio:float
        # time_format %d/%b/%Y:%H:%M:%S %z
    </parse>
        path /var/log/nginx/json_format.log
        tag nginx
    </source>`,
  CONFIGURATION_STEP4 = `<match nginx>
    @type opensearch
    <buffer>
      chunk_limit_size 1GB
      total_limit_size 2GB
      flush_interval 3s
      flush_thread_count 8
    </buffer>
    ssl_verify false
    host 10.53.97.136  #Enter your host name
    port 9200
    index_name nginx_json_format  # Enter your index name
    verify_os_version_at_startup false
    suppress_type_name true
    include_timestamp true
    </match>`,
  CONFIGURATION_STEP5 = ` "_source" : {
        "msec" : 1.654592648156E9,
        "connection" : 365,
        "connection_requests" : 1,
        "connections_active" : 2,
        "pid" : 110407,
        "request_id" : "758077d2f3f26a297fe9242d661e074a",
        "request_length" : 1128,
        "remote_addr" : "10.37.3.22",
        "remote_user" : "",
        "remote_port" : 51919,
        "time_local" : "07/Jun/2022:14:34:08 +0530",
        "time_iso8601" : "2022-06-07T14:34:08+05:30",
        "request" : "POST /wp-admin/admin-ajax.php HTTP/1.1",
        "request_uri" : "/wp-admin/admin-ajax.php",
        "args" : "",
        "status" : 200,
        "body_bytes_sent" : 58,
        "bytes_sent" : 562,
        "http_referer" : "http://10.53.97.136/wp-admin/edit.php",
        "http_user_agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36",
        "http_x_forwarded_for" : "",
        "http_host" : "10.53.97.136",
        "server_name" : "_",
        "request_time" : 0.029,
        "upstream" : "unix:/run/php/php7.4-fpm.sock",
        "upstream_connect_time" : 0.0,
        "upstream_header_time" : 0.032,
        "upstream_response_time" : 0.032,
        "upstream_response_length" : 65,
        "upstream_cache_status" : "",
        "ssl_protocol" : "",
        "ssl_cipher" : "",
        "scheme" : "http",
        "request_method" : "POST",
        "server_protocol" : "HTTP/1.1",
        "pipe" : ".",
        "gzip_ratio" : 0.0,
        "content_type" : "application/x-www-form-urlencoded; charset=UTF-8",
        "hostname" : "hj-datdpe13901.persistent.co.in",
        "content_length" : 127,
        "uri" : "/wp-admin/admin-ajax.php",
        "request_body" : "data%5Bwp-check-locked-posts%5D%5B%5D=post-1&interval=15&_nonce=3f2a20e904&action=heartbeat&screen_id=edit-post&has_focus=false",
        "https" : "",
        "modern_browser" : "",
        "msie" : "",
        "nginx_version" : "1.18.0",
        "connections_reading" : 0,
        "connections_waiting" : 1,
        "connections_writing" : 0,
        "date_gmt" : "Tuesday, 07-Jun-2022 09:04:08 GMT",
        "document_root" : "/var/www/wordpress",
        "document_uri" : "/wp-admin/admin-ajax.php",
        "tcpinfo_rttvar" : 2945,
        "tcpinfo_snd_cwnd" : 10,
        "tcpinfo_rcv_space" : 14600,
        "tcpinfo_rtt" : 5890,
        "upstream_addr" : "unix:/run/php/php7.4-fpm.sock",
        "query_string" : "",
        "request_body_file" : "",
        "request_completion" : "OK",
        "request_filename" : "/var/www/wordpress/wp-admin/admin-ajax.php",
        "realpath_root" : "/var/www/wordpress",
        "ssl_session_id" : "",
        "server_addr" : "10.53.97.136",
        "is_args" : "",
        "realip_remote_addr" : "10.37.3.22",
        "realip_remote_port" : 51919,
        "ssl_server_name" : "",
        "ssl_session_reused" : "",
        "ssl_client_verify" : "",
        "ssl_client_serial" : "",
        "ssl_client_s_dn" : "",
        "upstream_status" : 200,
        "uid_got" : "",
        "uid_reset" : "",
        "uid_set" : "",
        "proxy_host" : "",
        "proxy_port" : "",
        "proxy_protocol_addr" : "",
        "date_local" : "Tuesday, 07-Jun-2022 14:34:08 IST",
        "proxy_protocol_port" : "",
        "limit_rate" : 0,
        "server_port" : 80,
        "ssl_client_cert" : "",
        "ssl_client_fingerprint" : "",
        "ssl_client_i_dn" : "",
        "ssl_client_raw_cert" : "",
        "@timestamp" : "2022-06-07T14:34:08.157536533+05:30"
      }`,
}
