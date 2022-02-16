import { ether, wei, BN } from './helpers/ether';


const BigNumber = web3.utils.BN;

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

const WarXToken = artifacts.require('WarXToken');

contract('WarXToken', function ([_admin, _, receiver1, receiver2, creator]) {

    beforeEach(async function () {

        this.symbol = 'MWC';
        this.name = 'Meta Warriors Token';

        /* Deploy Token */
        this.token = await WarXToken.new(this.name, this.symbol);

        this.amount = 10;

        this.mintToken = await this.token.mint(receiver1, this.amount, { from: _admin });
    });

    describe('Token Parameters', function () {
        it('check the symbol', async function () {
            const symbol = await this.token.symbol();
            symbol.toString().should.be.equal(this.symbol.toString());
        });

        it('check the name', async function () {
            const name = await this.token.name();
            name.toString().should.be.equal(this.name.toString());
        });
    });

    describe('Token mint, pause & unpause', function () {
        it('should be token mint', async function () {
            const mintToken = await this.token.mint(receiver1, this.amount, { from: _admin });
            BN(mintToken['logs'][0]['args']['value']).toString().should.be.equal(this.amount.toString());
            mintToken['logs'][0]['args']['to'].should.be.equal(receiver1);
        });

        it('should be token pause', async function () {
            const pauseToken = await this.token.pause({ from: _admin });
            pauseToken['logs'][0]['event'].should.be.equal('Paused');
            pauseToken['logs'][0]['args']['account'].should.be.equal(_admin);
        });

        it('should be token unpause', async function () {
            await this.token.pause({ from: _admin });
            const pauseToken = await this.token.unpause({ from: _admin });
            pauseToken['logs'][0]['event'].should.be.equal('Unpaused');
            pauseToken['logs'][0]['args']['account'].should.be.equal(_admin);
        });
    });


    describe('Token revert mint, pause & unpause ', function () {
        it('should be revert token mint', async function () {
            await this.token.mint(receiver1, this.amount, { from: receiver1 }).should.be.rejectedWith('revert');
        });

        it('should be revert token pause', async function () {
            await this.token.pause({ from: receiver1 }).should.be.rejectedWith('revert');
        });

        it('should be revert token unpause', async function () {
            await this.token.pause({ from: _admin });
            await this.token.unpause({ from: receiver1 }).should.be.rejectedWith('revert');
        });
    });

    describe('Token Supply', function () {
        it('should be check token supply', async function () {
            let tokenSupplyBefore = await this.token.totalSupply();
            await this.token.mint(receiver1, this.amount, { from: _admin });
            let tokenSupplyAfter = await this.token.totalSupply();
            tokenSupplyBefore.should.not.be.equal(tokenSupplyAfter);
        });
    });

});