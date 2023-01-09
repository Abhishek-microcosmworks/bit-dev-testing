bit config set analytics_reporting false
bit config set anonymous_reporting false
bit config set user.token ${BIT_TOKEN}
echo @bit:registry=https://node.bit.dev >> .npmrc
echo //node.bit.dev/:_authToken=${BIT_TOKEN} >> .npmrc