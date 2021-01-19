import React from 'react';
import { Grid, Row, Col, Text, Icon } from 'native-base';

import common from '../../styles/common';

const PrimaryHeader = ({ icon, text, children }) => (
    <Grid style={[common.py15, common.px15, common.bgPrimary]}>
        <Row>
            <Col size={3} style={[common.flexRow, common.alignCenter]}>
                { !!icon && (
                    <Icon 
                        name={icon} 
                        style={[common.textWhite, common.mr10]} 
                    />
                )}
                
                { !!text && (
                    <Text style={common.textWhite}>
                        {text}
                    </Text>
                )}
            </Col>
            
            {!!children && (
                <Col size={1} style={[common.flexReverse]}>
                    {children}
                </Col>
            )}
        </Row>
    </Grid>
);

export default PrimaryHeader;