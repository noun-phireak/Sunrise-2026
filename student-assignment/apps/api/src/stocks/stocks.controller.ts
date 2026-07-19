import { Controller, Post, Get, Body, UseGuards, Request, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('stocks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('stocks')
export class StocksController {
    constructor(private readonly stocksService: StocksService) { }

    @Post('in')
    @ApiOperation({ summary: 'Request stock add (creates Pending stock)' })
    @ApiResponse({ status: 201, description: 'Stock request created.' })
    addStock(@Body() createStockDto: CreateStockDto, @Request() req) {
        // req.user.id from JwtAuthGuard
        return this.stocksService.addStock(createStockDto, req.user.userId);
    }

    @Post(':id/approve')
    @ApiOperation({ summary: 'Approve stock request' })
    @ApiResponse({ status: 200, description: 'Stock approved and inventory updated.' })
    approveStock(@Param('id') id: string) {
        return this.stocksService.approveStock(+id);
    }

    @Post(':id/reject')
    @ApiOperation({ summary: 'Reject stock request' })
    @ApiResponse({ status: 200, description: 'Stock request rejected.' })
    rejectStock(@Param('id') id: string) {
        return this.stocksService.rejectStock(+id);
    }

    @Get()
    @ApiOperation({ summary: 'List stock history' })
    @ApiResponse({ status: 200, description: 'List of stock entries.' })
    findAll() {
        return this.stocksService.findAll();
    }
}
