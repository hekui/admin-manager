FROM registry.cn-hangzhou.aliyuncs.com/fangguancha/base:nodejs-8.9.2

MAINTAINER register <register@chuangjia.me>

ENV PORT 3000
expose 3000

WORKDIR /data/work/

#加入node程序并安装npm包
ADD ./ ./
RUN cnpm install
RUN npm run build

CMD npm run start
