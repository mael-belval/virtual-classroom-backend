FROM --platform=linux/amd64 node:20-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV production

RUN corepack install --global yarn@stable

# Install dependencies based on the preferred package manager
COPY . .
COPY .yarnrc.yml ./

RUN yarn --frozen-lockfile
ENV PORT 4000
RUN yarn build

FROM --platform=linux/amd64 node:20-alpine as runner
WORKDIR /app

RUN corepack install --global yarn@stable

COPY --from=builder /app/ ./
COPY --from=builder /app/.yarn/releases ./.yarn/releases
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml

EXPOSE 4000

CMD ["yarn", "start"]
